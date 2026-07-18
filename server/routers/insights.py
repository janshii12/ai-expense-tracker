from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
import models

router = APIRouter(prefix="/insights", tags=["insights"])

@router.get("/summary")
def get_summary(user_id: str = Query(...), db: Session = Depends(get_db)):
    txns = db.query(models.Transaction).filter(models.Transaction.user_id == user_id).all()

    if not txns:
        return {"summary": "No transactions yet. Add some expenses first!"}

    total = sum(t.amount for t in txns)
    count = len(txns)
    avg = total / count

    cat_totals = (
        db.query(models.Category.name, func.sum(models.Transaction.amount))
        .join(models.Transaction, models.Transaction.category_id == models.Category.id)
        .filter(models.Transaction.user_id == user_id)
        .group_by(models.Category.name)
        .all()
    )

    if cat_totals:
        top_category, top_amount = max(cat_totals, key=lambda c: c[1])
        top_share = (top_amount / total) * 100 if total else 0
    else:
        top_category, top_amount, top_share = None, 0, 0

    biggest = max(txns, key=lambda t: t.amount)

    lines = [
        f"You've made {count} transactions totaling ₹{total:,.0f}, averaging ₹{avg:,.0f} per expense."
    ]
    if top_category:
        lines.append(
            f"{top_category} is your biggest spending area at ₹{top_amount:,.0f} ({top_share:.0f}% of your total)."
        )
    lines.append(
        f"Your largest single expense was \"{biggest.description}\" at ₹{biggest.amount:,.0f}."
    )
    if top_category:
        lines.append(f"Tip: try setting a monthly cap for {top_category} to keep it in check.")
    else:
        lines.append("Tip: tag your expenses with categories to get more useful breakdowns.")

    return {"summary": " ".join(lines)}