from datetime import datetime, date
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator

# Customer Application Input Schema
class LeadCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100, description="Full Name of the applicant")
    mobile: str = Field(..., pattern=r"^[6-9]\d{9}$", description="10-digit Indian Mobile Number")
    email: str = Field(..., description="Valid Email Address")
    dob: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$", description="Date of Birth in YYYY-MM-DD format")
    city: str = Field(..., min_length=2, max_length=50)
    pincode: str = Field(..., pattern=r"^\d{6}$", description="6-digit Pincode")
    
    loan_type: str = Field(..., description="Home Loan or Loan Against Property (LAP)")
    employment_type: str = Field(..., description="Salaried or Self Employed")
    monthly_income: float = Field(..., gt=0, description="Monthly Net Income in INR")
    loan_amount: float = Field(..., gt=0, description="Requested Loan Amount in INR")
    property_value: float = Field(..., gt=0, description="Estimated Property Value in INR")
    consent: bool = Field(..., description="Mandatory consent for info sharing")

    @field_validator('consent')
    def must_be_true(cls, v):
        if not v:
            raise ValueError('Consent is required to submit loan application.')
        return v

    @field_validator('dob')
    def validate_dob_age(cls, v):
        try:
            born = datetime.strptime(v, "%Y-%m-%d").date()
            today = date.today()
            age = today.year - born.year - ((today.month, today.day) < (born.month, born.day))
            if age < 18 or age > 100:
                raise ValueError('Applicant must be between 18 and 100 years of age.')
        except ValueError as e:
            if "Applicant must be" in str(e):
                raise e
            raise ValueError('Invalid date format. Use YYYY-MM-DD.')
        return v


# Lead Response Schema
class LeadResponse(BaseModel):
    id: int
    full_name: str
    mobile: str
    email: str
    dob: str
    city: str
    pincode: str
    loan_type: str
    employment_type: str
    monthly_income: float
    loan_amount: float
    property_value: float
    credit_score: int
    bre_status: str
    rejection_reasons: List[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LeadCreateResponse(BaseModel):
    status: str
    lead_id: Optional[int] = None
    credit_score: Optional[int] = None
    bre_status: Optional[str] = None
    rejection_reasons: Optional[List[str]] = None
    message: Optional[str] = None


# BRE Rule Schemas
class BRERuleCreate(BaseModel):
    rule_name: str = Field(..., min_length=1, max_length=100)
    field_name: str = Field(..., description="Field to evaluate: age, monthly_income, credit_score, loan_amount")
    operator: str = Field(..., description=">=, <=, >, <, ==, !=, <=_pct_of")
    target_field: Optional[str] = Field(None, description="e.g. property_value if operator is <=_pct_of")
    value: str = Field(..., description="Comparison target value e.g. 21, 60, 30000, 700, 80")
    error_message: str = Field(..., min_length=1, max_length=255)
    is_active: bool = True


class BRERuleUpdate(BaseModel):
    rule_name: Optional[str] = None
    field_name: Optional[str] = None
    operator: Optional[str] = None
    target_field: Optional[str] = None
    value: Optional[str] = None
    error_message: Optional[str] = None
    is_active: Optional[bool] = None


class BRERuleResponse(BaseModel):
    id: int
    rule_name: str
    field_name: str
    operator: str
    target_field: Optional[str] = None
    value: str
    error_message: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Authentication Schemas
class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str
    role: str


# Dashboard Statistics Schema
class DashboardStats(BaseModel):
    total_leads: int
    eligible_leads: int
    rejected_leads: int
    avg_credit_score: float
    loan_type_breakdown: dict
    rejection_reasons_breakdown: dict
