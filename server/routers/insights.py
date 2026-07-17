from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
import models, os
from dotenv import load_dotenv
from google import genai

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

router = APIRouter(prefix="/insights", tags=["insights"])

@router.get("/summary")
def get_summary(user_id: str = Query(...), db: Session = Depends(get_db)):
    txns = db.query(models.Transaction).filter(models.Transaction.user_id == user_id).all()

    if not txns:
        return {"summary": "No transactions yet. Add some expenses first!"}

    txn_text = "\n".join([f"{t.description}: ₹{t.amount}" for t in txns])

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"Here are my recent expenses:\n{txn_text}\n\nGive me a short, friendly 2-3 sentence summary of my spending habits and one practical tip to save money."
        )
        return {"summary": response.text}
    except Exception as e:
        return {"summary": f"AI insight unavailable right now: {str(e)}"}

@router.get("/list-models")
def list_models():
    models_list = client.models.list()
    return [m.name for m in models_list]