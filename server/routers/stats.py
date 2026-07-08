from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
import models

router = APIRouter(prefix="/stats", tags=["stats"])

@router.get("/monthly-total")
def monthly_total(user_id: str = Query(...), db: Session = Depends(get_db)):
    total = (
        db.query(func.sum(models.Transaction.amount))
        .filter(models.Transaction.user_id == user_id)
        .scalar() or 0
    )
    return {"total": total}