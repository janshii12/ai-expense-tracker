from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
import models, os
from dotenv import load_dotenv
import anthropic

load_dotenv()
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

router = APIRouter(prefix="/insights", tags=["insights"])

@router.get("/summary")
def get_summary(user_id: str = Query(...), db: Session = Depends(get_db)):
    txns = db.query(models.Transaction).filter(models.Transaction.user_id == user_id).all()
    if not txns:
        return {"summary": "No transactions yet. Add some expenses first!"}
    txn_text = "\n".join([f"{t.description}: ₹{t.amount}" for t in txns])
    message = client.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=300,
        messages=[{"role": "user", "content": f"Here are my recent expenses:\n{txn_text}\n\nGive me a short, friendly 2-3 sentence summary and one money-saving tip."}]
    )
    return {"summary": message.content[0].text}