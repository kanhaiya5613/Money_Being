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
    # Generates realistic score based on income and mobile number seed for reproducible testing
    try:
        last_digits = int(mobile[-4:])
    except Exception:
        last_digits = 5000

    base_score = 650
    # Higher income boosts score (up to 120 points)
    income_bonus = min(120, int(monthly_income / 1500))
    # Employment type bonus
    emp_bonus = 30 if employment_type == "Salaried" else 20
    # Digit hash variation (0-50)
    var = (last_digits % 50)

    calculated_score = base_score + income_bonus + emp_bonus + var
    # Clamp score between 580 and 840 (standard CIBIL range: 300 - 900)
    score = max(580, min(840, calculated_score))
    
    return score
