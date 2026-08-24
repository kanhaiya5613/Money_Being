from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import BRERule, User
from backend.schemas import BRERuleCreate, BRERuleUpdate, BRERuleResponse
from backend.services.auth import get_current_user

router = APIRouter(prefix="/api/rules", tags=["BRE Rules"])

@router.get("", response_model=List[BRERuleResponse])
def get_all_rules(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(BRERule).order_by(BRERule.id.asc()).all()


@router.post("", response_model=BRERuleResponse, status_code=status.HTTP_201_CREATED)
def create_rule(
    rule_in: BRERuleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_rule = BRERule(
        rule_name=rule_in.rule_name,
        field_name=rule_in.field_name,
        operator=rule_in.operator,
        target_field=rule_in.target_field,
        value=rule_in.value,
        error_message=rule_in.error_message,
        is_active=rule_in.is_active
    )
    db.add(new_rule)
    db.commit()
    db.refresh(new_rule)
    return new_rule


@router.put("/{rule_id}", response_model=BRERuleResponse)
def update_rule(
    rule_id: int,
    rule_in: BRERuleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rule = db.query(BRERule).filter(BRERule.id == rule_id).first()
    if not rule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"BRE Rule with ID {rule_id} not found."
        )

    update_data = rule_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(rule, field, value)

    db.commit()
    db.refresh(rule)
    return rule


@router.delete("/{rule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_rule(
    rule_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rule = db.query(BRERule).filter(BRERule.id == rule_id).first()
    if not rule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"BRE Rule with ID {rule_id} not found."
        )

    db.delete(rule)
    db.commit()
    return None
