from fastapi import FastAPI
from pydantic import BaseModel
from fastapi import FastAPI, Form, Depends, Request
from .database import Base, engine, SessionLocal


app = FastAPI()

def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

@app.get("/")
async def root():
    return {"message": "Hello World"}
