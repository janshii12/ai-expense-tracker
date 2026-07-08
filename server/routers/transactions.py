from fastapi import APIRouter, Depends , Query
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.post("/")
def create_transaction(data: dict, db: Session = Depends(get_db)):
    txn = models.Transaction(
        amount=data["amount"],
        description=data["description"],
        date=data["date"],
        user_id=data["user_id"],
        category_id=data.get("category_id"),
    )
    db.add(txn)
    db.commit()
    db.refresh(txn)
    return {"id": txn.id, "amount": txn.amount, "description": txn.description}

@router.get("/")
def list_transactions(user_id: str = Query(...), db: Session = Depends(get_db)):
    txns = db.query(models.Transaction).filter(models.Transaction.user_id == user_id).all()
    return [
        {"id": t.id, "amount": t.amount, "description": t.description, "date": str(t.date)}
        for t in txns
    ]