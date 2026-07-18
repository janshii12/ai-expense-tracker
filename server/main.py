import os
from fastapi import FastAPI
from database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
import models
from routers import users,transactions,stats,insights

Base.metadata.create_all(bind=engine)

app = FastAPI()
default_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
extra_origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=default_origins + extra_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(transactions.router)
app.include_router(stats.router)
app.include_router(insights.router)

@app.get("/")
def root():
    return {"status": "ok"}