from fastapi import FastAPI
from database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
import models
from routers import users

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)

@app.get("/")
def root():
    return {"status": "ok"}