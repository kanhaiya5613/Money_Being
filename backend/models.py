import json
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text
from backend.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    mobile = Column(String(15), unique=True, index=True, nullable=False)
    email = Column(String(100), nullable=False)
    dob = Column(String(10), nullable=False)  # Format: YYYY-MM-DD
    city = Column(String(50), nullable=False)
    pincode = Column(String(10), nullable=False)
    
    loan_type = Column(String(50), nullable=False)        # Home Loan, LAP
    employment_type = Column(String(50), nullable=False)  # Salaried, Self Employed
    monthly_income = Column(Float, nullable=False)
    loan_amount = Column(Float, nullable=False)
    property_value = Column(Float, nullable=False)
    consent = Column(Boolean, nullable=False, default=True)
    
    credit_score = Column(Integer, nullable=False)
    bre_status = Column(String(20), nullable=False)  # Eligible, Not Eligible
    rejection_reasons = Column(Text, nullable=True)  # JSON formatted string array
    
    created_at = Column(DateTime(timezone=True), default=utc_now)

    def set_rejection_reasons(self, reasons_list):
        self.rejection_reasons = json.dumps(reasons_list)

    def get_rejection_reasons(self):
        if not self.rejection_reasons:
            return []
        try:
            return json.loads(self.rejection_reasons)
        except Exception:
            return [self.rejection_reasons]


class BRERule(Base):
    __tablename__ = "bre_rules"

    id = Column(Integer, primary_key=True, index=True)
    rule_name = Column(String(100), nullable=False)
    field_name = Column(String(50), nullable=False)      # age, monthly_income, credit_score, loan_amount
    operator = Column(String(20), nullable=False)        # >=, <=, >, <, ==, !=, <=_pct_of
    target_field = Column(String(50), nullable=True)     # property_value (if operator is <=_pct_of)
    value = Column(String(50), nullable=False)           # 21, 60, 30000, 700, 80
    error_message = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default="admin")
    
    created_at = Column(DateTime(timezone=True), default=utc_now)
