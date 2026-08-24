import sys
import os

# Add root directory to python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.database import engine, Base, SessionLocal
from backend.models import User, BRERule, Lead
from backend.services.auth import get_password_hash

def seed_db(db_session=None):
    close_db = False
    if db_session is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        close_db = True
    else:
        db = db_session

    try:
        # 1. Seed Admin User
        admin_user = db.query(User).filter(User.username == "admin").first()
        if not admin_user:
            admin_user = User(
                username="admin",
                email="admin@moneybeing.com",
                hashed_password=get_password_hash("admin123"),
                role="admin"
            )
            db.add(admin_user)
            db.commit()

        # 2. Seed Default BRE Rules (as specified in Assessment doc)
        existing_rules_count = db.query(BRERule).count()
        if existing_rules_count == 0:
            default_rules = [
                BRERule(
                    rule_name="Minimum Applicant Age",
                    field_name="age",
                    operator=">=",
                    value="21",
                    error_message="Applicant age must be at least 21 years",
                    is_active=True
                ),
                BRERule(
                    rule_name="Maximum Applicant Age",
                    field_name="age",
                    operator="<=",
                    value="60",
                    error_message="Applicant age must not exceed 60 years",
                    is_active=True
                ),
                BRERule(
                    rule_name="Minimum Monthly Income",
                    field_name="monthly_income",
                    operator=">=",
                    value="30000",
                    error_message="Monthly Income below minimum eligibility criteria (₹30,000)",
                    is_active=True
                ),
                BRERule(
                    rule_name="Minimum Credit Score",
                    field_name="credit_score",
                    operator=">=",
                    value="700",
                    error_message="Credit Score below minimum requirement (700)",
                    is_active=True
                ),
                BRERule(
                    rule_name="Maximum Loan to Value (LTV)",
                    field_name="loan_amount",
                    operator="<=_pct_of",
                    target_field="property_value",
                    value="80",
                    error_message="Loan Amount exceeds eligible limit (80% of Property Value)",
                    is_active=True
                ),
            ]
            db.add_all(default_rules)
            db.commit()

        # 3. Seed Sample Leads safely
        sample_leads_data = [
            {
                "full_name": "Rajesh Sharma",
                "mobile": "9876543210",
                "email": "rajesh.sharma@example.com",
                "dob": "1992-05-15",
                "city": "Mumbai",
                "pincode": "400001",
                "loan_type": "Home Loan",
                "employment_type": "Salaried",
                "monthly_income": 75000,
                "loan_amount": 4000000,
                "property_value": 6000000,
                "consent": True,
                "credit_score": 765,
                "bre_status": "Eligible",
                "rejection_reasons": "[]"
            },
            {
                "full_name": "Priya Patel",
                "mobile": "9812345678",
                "email": "priya.patel@example.com",
                "dob": "1998-11-20",
                "city": "Ahmedabad",
                "pincode": "380009",
                "loan_type": "Loan Against Property (LAP)",
                "employment_type": "Self Employed",
                "monthly_income": 25000,
                "loan_amount": 2500000,
                "property_value": 3000000,
                "consent": True,
                "credit_score": 680,
                "bre_status": "Not Eligible",
                "rejection_reasons": '["Monthly Income below minimum eligibility criteria (₹30,000)", "Credit Score below minimum requirement (700)", "Loan Amount exceeds eligible limit (80% of Property Value) (Requested: ₹2,500,000, Max Allowed: ₹2,400,000)"]'
            },
            {
                "full_name": "Amit Verma",
                "mobile": "9988776655",
                "email": "amit.verma@example.com",
                "dob": "1985-03-10",
                "city": "Delhi",
                "pincode": "110001",
                "loan_type": "Home Loan",
                "employment_type": "Salaried",
                "monthly_income": 120000,
                "loan_amount": 5000000,
                "property_value": 8000000,
                "consent": True,
                "credit_score": 790,
                "bre_status": "Eligible",
                "rejection_reasons": "[]"
            }
        ]

        for lead_info in sample_leads_data:
            existing = db.query(Lead).filter(Lead.mobile == lead_info["mobile"]).first()
            if not existing:
                db.add(Lead(**lead_info))
        db.commit()

    finally:
        if close_db:
            db.close()

if __name__ == "__main__":
    seed_db()
