from datetime import datetime, date
from typing import Tuple, List, Dict, Any
from sqlalchemy.orm import Session
from backend.models import BRERule

def calculate_age(dob_str: str) -> int:
    """Calculates age in years from YYYY-MM-DD date string."""
    try:
        born = datetime.strptime(dob_str, "%Y-%m-%d").date()
        today = date.today()
        return today.year - born.year - ((today.month, today.day) < (born.month, born.day))
    except Exception:
        return 0


def evaluate_lead(lead_data: Dict[str, Any], credit_score: int, db: Session) -> Tuple[str, List[str]]:
    """
    Dynamically evaluates applicant details against active rules stored in the database.
    Returns a tuple of (bre_status: str, rejection_reasons: List[str]).
    """
    rejection_reasons = []
    
    # Calculate derived parameters
    applicant_age = calculate_age(lead_data.get("dob", ""))
    monthly_income = float(lead_data.get("monthly_income", 0))
    loan_amount = float(lead_data.get("loan_amount", 0))
    property_value = float(lead_data.get("property_value", 0))
    
    context = {
        "age": applicant_age,
        "monthly_income": monthly_income,
        "credit_score": credit_score,
        "loan_amount": loan_amount,
        "property_value": property_value,
        "employment_type": lead_data.get("employment_type", ""),
        "loan_type": lead_data.get("loan_type", ""),
    }

    # Fetch active rules from DB
    active_rules = db.query(BRERule).filter(BRERule.is_active == True).all()

    for rule in active_rules:
        field_val = context.get(rule.field_name)
        if field_val is None:
            continue

        op = rule.operator.strip()
        failed = False
        reason = rule.error_message

        try:
            if op == ">=":
                if float(field_val) < float(rule.value):
                    failed = True
            elif op == "<=":
                if float(field_val) > float(rule.value):
                    failed = True
            elif op == ">":
                if float(field_val) <= float(rule.value):
                    failed = True
            elif op == "<":
                if float(field_val) >= float(rule.value):
                    failed = True
            elif op == "==":
                if str(field_val).lower() != str(rule.value).lower():
                    failed = True
            elif op == "!=":
                if str(field_val).lower() == str(rule.value).lower():
                    failed = True
            elif op == "<=_pct_of":
                # e.g., loan_amount <= 80% of property_value
                target_field_name = rule.target_field or "property_value"
                base_val = context.get(target_field_name, 0)
                allowed_max = (float(rule.value) / 100.0) * float(base_val)
                if float(field_val) > allowed_max:
                    failed = True
                    reason = f"{rule.error_message} (Requested: ₹{field_val:,.0f}, Max Allowed: ₹{allowed_max:,.0f})"
        except Exception:
            # If data conversion or evaluation fails, mark as soft pass or log
            pass

        if failed:
            rejection_reasons.append(reason)

    if not rejection_reasons:
        return "Eligible", []
    else:
        return "Not Eligible", rejection_reasons
