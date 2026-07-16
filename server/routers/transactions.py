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
        {
            "id": t.id,
            "amount": t.amount,
            "description": t.description,
            "date": str(t.date),
            "category_id": t.category_id,
        }
        for t in txns
    ]

@router.post("/categories")
def create_category(data: dict, db: Session = Depends(get_db)):
    cat = models.Category(name=data["name"])
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return {"id": cat.id, "name": cat.name}

@router.get("/categories")
def list_categories(db: Session = Depends(get_db)):
    cats = db.query(models.Category).all()
    return [{"id": c.id, "name": c.name} for c in cats]

@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: str, db: Session = Depends(get_db)):
    txn = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if not txn:
        return {"error": "Not found"}
    db.delete(txn)
    db.commit()
    return {"deleted": True}

@router.put("/{transaction_id}")
def update_transaction(transaction_id: str, data: dict, db: Session = Depends(get_db)):
    txn = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if not txn:
        return {"error": "Not found"}
    txn.amount = data.get("amount", txn.amount)
    txn.description = data.get("description", txn.description)
    db.commit()
    db.refresh(txn)
    return {"id": txn.id, "amount": txn.amount, "description": txn.description}