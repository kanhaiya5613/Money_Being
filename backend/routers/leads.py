import io
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from openpyxl import Workbook

from backend.database import get_db
from backend.models import Lead, User
from backend.schemas import LeadCreate, LeadCreateResponse, LeadResponse, DashboardStats
from backend.services.credit_score import fetch_credit_score
from backend.services.bre import evaluate_lead
from backend.services.auth import get_current_user

router = APIRouter(prefix="/api/leads", tags=["Leads"])

@router.post("", response_model=LeadCreateResponse, status_code=status.HTTP_201_CREATED)
async def create_lead(lead_in: LeadCreate, db: Session = Depends(get_db)):
    # Module 8: Duplicate Lead Validation by Mobile Number
    existing_lead = db.query(Lead).filter(Lead.mobile == lead_in.mobile).first()
    if existing_lead:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lead already exists"
        )

    # Module 2: Fetch Credit Score
    credit_score = await fetch_credit_score(
        mobile=lead_in.mobile,
        monthly_income=lead_in.monthly_income,
        employment_type=lead_in.employment_type
    )

    # Module 3: Execute Business Rule Engine (BRE)
    lead_dict = lead_in.model_dump()
    bre_status, rejection_reasons = evaluate_lead(lead_dict, credit_score, db)

    # Save Lead in Database
    new_lead = Lead(
        full_name=lead_in.full_name,
        mobile=lead_in.mobile,
        email=lead_in.email,
        dob=lead_in.dob,
        city=lead_in.city,
        pincode=lead_in.pincode,
        loan_type=lead_in.loan_type,
        employment_type=lead_in.employment_type,
        monthly_income=lead_in.monthly_income,
        loan_amount=lead_in.loan_amount,
        property_value=lead_in.property_value,
        consent=lead_in.consent,
        credit_score=credit_score,
        bre_status=bre_status
    )
    new_lead.set_rejection_reasons(rejection_reasons)

    db.add(new_lead)
    db.commit()
    db.refresh(new_lead)

    # Module 7: API Response
    return LeadCreateResponse(
        status="success",
        lead_id=new_lead.id,
        credit_score=credit_score,
        bre_status=bre_status,
        rejection_reasons=rejection_reasons
    )


@router.get("", response_model=dict)
def get_leads(
    search: Optional[str] = Query(None, description="Search by customer name, mobile or email"),
    loan_type: Optional[str] = Query(None, description="Filter by Home Loan or Loan Against Property (LAP)"),
    bre_status: Optional[str] = Query(None, description="Filter by Eligible or Not Eligible"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Lead)

    if search:
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Lead.full_name.ilike(search_fmt),
                Lead.mobile.ilike(search_fmt),
                Lead.email.ilike(search_fmt),
                Lead.city.ilike(search_fmt)
            )
        )

    if loan_type:
        query = query.filter(Lead.loan_type == loan_type)

    if bre_status:
        query = query.filter(Lead.bre_status == bre_status)

    total = query.count()
    offset = (page - 1) * limit
    leads = query.order_by(Lead.created_at.desc()).offset(offset).limit(limit).all()

    items = []
    for l in leads:
        items.append({
            "id": l.id,
            "full_name": l.full_name,
            "mobile": l.mobile,
            "email": l.email,
            "dob": l.dob,
            "city": l.city,
            "pincode": l.pincode,
            "loan_type": l.loan_type,
            "employment_type": l.employment_type,
            "monthly_income": l.monthly_income,
            "loan_amount": l.loan_amount,
            "property_value": l.property_value,
            "credit_score": l.credit_score,
            "bre_status": l.bre_status,
            "rejection_reasons": l.get_rejection_reasons(),
            "created_at": l.created_at.isoformat()
        })

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit if total > 0 else 1,
        "data": items
    }


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_leads = db.query(func.count(Lead.id)).scalar() or 0
    eligible_leads = db.query(func.count(Lead.id)).filter(Lead.bre_status == "Eligible").scalar() or 0
    rejected_leads = db.query(func.count(Lead.id)).filter(Lead.bre_status == "Not Eligible").scalar() or 0
    
    avg_score_res = db.query(func.avg(Lead.credit_score)).scalar()
    avg_credit_score = round(float(avg_score_res), 1) if avg_score_res else 0.0

    # Loan type breakdown
    loan_types = db.query(Lead.loan_type, func.count(Lead.id)).group_by(Lead.loan_type).all()
    loan_type_breakdown = {lt: cnt for lt, cnt in loan_types}

    # Rejection reasons breakdown
    rejected_items = db.query(Lead).filter(Lead.bre_status == "Not Eligible").all()
    rejection_reasons_breakdown = {}
    for item in rejected_items:
        reasons = item.get_rejection_reasons()
        for r in reasons:
            rejection_reasons_breakdown[r] = rejection_reasons_breakdown.get(r, 0) + 1

    return DashboardStats(
        total_leads=total_leads,
        eligible_leads=eligible_leads,
        rejected_leads=rejected_leads,
        avg_credit_score=avg_credit_score,
        loan_type_breakdown=loan_type_breakdown,
        rejection_reasons_breakdown=rejection_reasons_breakdown
    )


@router.get("/export/excel")
def export_leads_excel(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    leads = db.query(Lead).order_by(Lead.created_at.desc()).all()
    
    wb = Workbook()
    ws = wb.active
    ws.title = "Leads Summary"

    headers = [
        "Lead ID", "Customer Name", "Mobile", "Email", "City",
        "Loan Type", "Employment Type", "Monthly Income (INR)",
        "Loan Amount (INR)", "Property Value (INR)", "Credit Score",
        "BRE Status", "Rejection Reasons", "Created Date"
    ]
    ws.append(headers)

    for l in leads:
        reasons_str = "; ".join(l.get_rejection_reasons()) if l.get_rejection_reasons() else "N/A"
        ws.append([
            l.id,
            l.full_name,
            l.mobile,
            l.email,
            l.city,
            l.loan_type,
            l.employment_type,
            l.monthly_income,
            l.loan_amount,
            l.property_value,
            l.credit_score,
            l.bre_status,
            reasons_str,
            l.created_at.strftime("%Y-%m-%d %H:%M:%S")
        ])

    stream = io.BytesIO()
    wb.save(stream)
    stream.seek(0)

    headers = {
        'Content-Disposition': 'attachment; filename="Loan_Leads_Report.xlsx"'
    }
    return StreamingResponse(
        stream,
        headers=headers,
        media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
