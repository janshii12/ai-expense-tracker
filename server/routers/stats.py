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

@router.get("/anomalies")
def get_anomalies(user_id: str = Query(...), db: Session = Depends(get_db)):
    results = (
        db.query(models.Category.name, func.sum(models.Transaction.amount), func.avg(models.Transaction.amount))
        .join(models.Transaction, models.Transaction.category_id == models.Category.id)
        .filter(models.Transaction.user_id == user_id)
        .group_by(models.Category.name)
        .all()
    )
    anomalies = []
    for name, total, avg in results:
        if total > (avg * 2):
            anomalies.append({"category": name, "total": total})
    return anomalies