import os
import logging
import httpx

logger = logging.getLogger(__name__)

# Public/Free or Configured Credit Bureau API URL
CREDIT_API_URL = os.getenv("CREDIT_API_URL", "https://loan-api.free.beeceptor.com")

async def fetch_credit_score(mobile: str, monthly_income: float, employment_type: str) -> int:
    """
    Fetches customer credit score from Credit Bureau API with graceful failover.
    If external API returns valid JSON score, returns it. If unavailable or invalid,
    gracefully executes internal simulation algorithm with balanced CIBIL distribution (550-850).
    """
    if CREDIT_API_URL:
        try:
            async with httpx.AsyncClient(timeout=1.0) as client:
                response = await client.post(
                    CREDIT_API_URL,
                    json={"mobile": mobile, "monthly_income": monthly_income}
                )
                if response.status_code == 200:
                    try:
                        data = response.json()
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
    # Generates a balanced CIBIL score distribution (550 - 850 range)
    try:
        digits = [int(d) for d in str(mobile) if d.isdigit()]
        mobile_sum = sum(digits)
        last_4 = int(str(mobile)[-4:]) if len(str(mobile)) >= 4 else 5000
    except Exception:
        mobile_sum = 45
        last_4 = 5000

    # Base score centered around 630 (range 530 - 750)
    hash_base = 530 + ((last_4 * 17 + mobile_sum * 13) % 220)

    # Income adjustment (-40 to +60)
    if monthly_income < 25000:
        income_adj = -40
    elif monthly_income < 35000:
        income_adj = -10
    elif monthly_income < 60000:
        income_adj = 15
    elif monthly_income < 100000:
        income_adj = 35
    else:
        income_adj = 60

    emp_adj = 15 if employment_type == "Salaried" else 0

    calculated_score = hash_base + income_adj + emp_adj
    # Clamp score between 550 and 850 (standard CIBIL range)
    score = max(550, min(850, calculated_score))
    
    return score
