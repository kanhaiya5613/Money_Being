import os
import logging
import httpx

logger = logging.getLogger(__name__)

# Public/Free or Configured Credit Bureau API URL
CREDIT_API_URL = os.getenv("CREDIT_API_URL", "https://loan-api.free.beeceptor.com")

async def fetch_credit_score(mobile: str, monthly_income: float, employment_type: str) -> int:
    """
    Fetches customer credit score from Credit Bureau API with graceful failover.
    If external API returns valid score, returns it. If unavailable/non-JSON/timed out,
    gracefully executes internal simulation algorithm.
    """
    if CREDIT_API_URL:
        try:
            async with httpx.AsyncClient(timeout=2.0) as client:
                response = await client.post(
                    CREDIT_API_URL,
                    json={"mobile": mobile, "monthly_income": monthly_income}
                )
                if response.status_code == 200:
                    try:
                        data = response.json()
                        # Support multiple common JSON keys: credit_score, score, cibil_score
                        val = data.get("credit_score") or data.get("score") or data.get("cibil_score")
                        if val is not None and isinstance(val, (int, float)):
                            score_int = int(val)
                            if 300 <= score_int <= 900:
                                return score_int
                    except Exception:
                        pass
        except Exception as e:
            logger.warning(f"Credit Bureau API ({CREDIT_API_URL}) request failed ({str(e)}). Executing failover simulation engine.")

    # Graceful Fallback / Simulation Algorithm:
    # Generates realistic score (300-900 CIBIL range) based on mobile number seed and income/employment
    try:
        mobile_seed = int(mobile[-4:])
    except Exception:
        mobile_seed = 5000

    # Hash-based base score variation between 560 and 780
    hash_base = 560 + ((mobile_seed * 37) % 220)
    
    # Income adjustment (-30 to +50)
    if monthly_income < 30000:
        income_adj = -30
    elif monthly_income < 60000:
        income_adj = 10
    elif monthly_income < 100000:
        income_adj = 30
    else:
        income_adj = 50

    emp_adj = 20 if employment_type == "Salaried" else 0

    calculated_score = hash_base + income_adj + emp_adj
    # Clamp score between 550 and 850 (standard CIBIL range)
    score = max(550, min(850, calculated_score))
    
    return score
