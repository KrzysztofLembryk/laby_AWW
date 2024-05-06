from typing import Annotated, List, Dict
from pydantic import BaseModel
from fastapi import FastAPI, Form, Depends
from collections import Counter
from .database import Base, engine, SessionLocal
from sqlalchemy.orm import Session, sessionmaker, joinedload
from . import models
from collections import Counter


app = FastAPI()

Base.metadata.create_all(bind=engine)

def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

class Image(BaseModel):
    name: str
    tags: List[str]

@app.get("/")
def get_svg_imgs(db: Session = Depends(get_db)):
    return db.query(models.ObrazkiAppSvgImage).all()

@app.get("/images")
def get_images(db: Session = Depends(get_db)):
    # Najpierw laczymy nazwy tagow z tagged item
    query = db.query(models.TaggitTaggeditem, models.TaggitTag, models.ObrazkiAppSvgImage). \
    join(models.TaggitTag, models.TaggitTaggeditem.tag_id == models.TaggitTag.id). \
    join(models.ObrazkiAppSvgImage, models.TaggitTaggeditem.object_id == models.ObrazkiAppSvgImage.id).all()
    res = []
    for elem in query:
        x = {"image_name": elem[2].name, "tag_name": elem[1].name}
        res.append(x)
    
    svg_names = {obj["image_name"]: [] for obj in res}
    for obj in res:
        svg_names[obj["image_name"]].append(obj["tag_name"])

    return svg_names

@app.get("/images/{tag}")
def get_images_by_tag(tag: int, db: Session = Depends(get_db)):

    query = db.query(models.TaggitTaggeditem, models.TaggitTag, models.ObrazkiAppSvgImage). \
    join(models.TaggitTag, models.TaggitTaggeditem.tag_id == models.TaggitTag.id). \
    join(models.ObrazkiAppSvgImage, models.TaggitTaggeditem.object_id == models.ObrazkiAppSvgImage.id).filter(models.TaggitTag.id == tag).all()

    res = []
    for elem in query:
        x = {"image_name": elem[2].name, "tag_name": elem[1].name}
        res.append(x)
    
    svg_names = {obj["image_name"]: [] for obj in res}
    for obj in res:
        svg_names[obj["image_name"]].append(obj["tag_name"])

    return svg_names

class ImagesToDelete(BaseModel):
    ids: List[int]

@app.delete("/images/del/")
def delete_images(images_to_delete: ImagesToDelete, db: Session = Depends(get_db)):
    for id in images_to_delete.ids:
        db.query(models.ObrazkiAppSvgImage).filter(models.ObrazkiAppSvgImage.id == id).delete()
        db.commit()
    return {"Images deleted": images_to_delete}


@app.get("/tags")
def list_tags(db: Session = Depends(get_db)):
    # dostajemy liste tupli (tagged_item, taggit_tag), wiec do nich musimy
    # sie odwolac jako elem[0] i elem[1], ale potem juz mozemy zrobic na nich
    # operacje jak na normalnych obiektach, np. elem[0].object_id
    query = db.query(models.TaggitTaggeditem, models.TaggitTag).join(models.TaggitTag).all()
    res = []

    for elem in query:
        x = {"tag_id": elem[1].id, "tag_name": elem[1].name, "object_id": elem[0].object_id}
        res.append(x)

    tag_counter = {tag["tag_name"]: 0 for tag in res}
    for tag in res:
        tag_counter[tag["tag_name"]] += 1

    return tag_counter

# @app.get("/tag")
# def list_tags():
#     tag_counter = Counter(tag for image in images for tag in image.tags)
#     return dict(tag_counter)