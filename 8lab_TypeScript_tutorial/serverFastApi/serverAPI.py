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
    
    svg_image = models.SvgImage(name=data_json["name"], width=data_json["width"], height=data_json["height"], svg=json.dumps(data_json["rects"]))
    db.add(svg_image)
    db.commit()
    return {"message": "added svg image of name: " + svg_name}

@app.get("/imgLst")
async def img_lst(db: Session = Depends(get_db)):
    images = db.query(models.SvgImage).all()
    return {image.name:{"width": image.width, "height": image.height, "rects": json.loads(image.svg)}  for image in images}