from fastapi import FastAPI
from pydantic import BaseModel
from fastapi import FastAPI, Form, Depends, Request
from .database import Base, engine, SessionLocal
from sqlalchemy.orm import Session, sessionmaker, joinedload
from typing import List, Dict
import json
from . import models
import random
from datetime import datetime
import time
from fastapi import HTTPException

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

def too_big_svg():
    svg = {}
    svg["width"] = 350
    svg["height"] = 350
    svg["rects"] = []
    random.seed(datetime.now().timestamp())

    for i in range(1, random.randint(10,120)):
        x1 = random.randint(0, 298)
        y1 = random.randint(0, 298)
        x2 = random.randint(x1 + 1, 300)
        y2 = random.randint(y1 + 1, 300)
        width = x2 - x1
        height = y2 - y1
        color = "#"+''.join([random.choice('0123456789ABCDEF') for j in range(6)])
        svg["rects"].append(
                            {
                                "x": x1,
                                "y": y1,
                                "width": width,
                                "height": height,
                                "fill": color,
                                "stroke": "",
                                "stroke-width": 0
                            })
    return svg

def ret_random_good_svg(images):
    random_number = random.randint(0, len(images) - 1)
    image = images[random_number]
    return {"width": image.width, "height": image.height, "rects": json.loads(image.svg)}

def lengthy_generating_svg(images):
    time.sleep(5)
    return ret_random_good_svg(images)

def ret_500_error():
    raise HTTPException(status_code=500, detail="Internal Server Error - happened when generating random svg image.")



@app.get("/randomImg")
async def random_img(db: Session = Depends(get_db)):
    images = db.query(models.SvgImage).all()
    random_number = random.randint(0, 4)

    if (random_number == 0):
        return json.dumps(too_big_svg())
    elif (random_number == 1):
        return json.dumps(lengthy_generating_svg(images))
    elif (random_number == 2):
        return ret_500_error()
    else:
        # Rozpatrzyc przypadek gdy zero svg obrazkow
        return json.dumps(ret_random_good_svg(images))