from fastapi import FastAPI
from pydantic import BaseModel
from fastapi import FastAPI, Form, Depends, Request
from .database import Base, engine, SessionLocal
from sqlalchemy.orm import Session, sessionmaker, joinedload
from typing import List, Dict
import json
from . import models

app = FastAPI()
Base.metadata.create_all(bind=engine)

def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

@app.post("/save")
async def save(data_json: Dict, db: Session = Depends(get_db)):
    svg_name = ""
    for key in data_json.keys():
        svg_name = key
        svg_image = models.SvgImage(name=key, svg=json.dumps(data_json[key]))
        db.add(svg_image)
    db.commit()
    return {"message": "added svg image of name: " + svg_name}

@app.get("/imgLst")
async def img_lst(db: Session = Depends(get_db)):
    images = db.query(models.SvgImage).all()
    return {image.name: json.loads(image.svg) for image in images}
