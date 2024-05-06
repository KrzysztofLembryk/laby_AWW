from typing import Annotated, List, Dict
from pydantic import BaseModel
from fastapi import FastAPI, Form, Depends, Request
from collections import Counter
from .database import Base, engine, SessionLocal
from sqlalchemy.orm import Session, sessionmaker, joinedload
from . import models
from collections import Counter
import os


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


def delete_svg_files(name: str):
    root_file_path = '../5lab_django_intro/my_site/static/svg/' 
    file_path = root_file_path + name + '.svg'

    if os.path.exists(file_path):
        try:
            os.remove(file_path)
        except Exception as e:
            print(e)

    file_path_thumb = root_file_path + name + "_thumb.svg"
    if os.path.exists(file_path_thumb):
        try:
            os.remove(file_path_thumb)
        except Exception as e:
            print(e)

class ImagesToDelete(BaseModel):
    ids: List[int]


# def main(payload: Dict[Any, Any]):
@app.post("/images/del")
async def delete_images(imgs: Dict, db: Session = Depends(get_db)):
    # req_json = dict(req.query_params)
    id_lst= []
    for id in imgs.values():
        id_lst.append(id)
        query = db.query(models.ObrazkiAppSvgImage).filter(models.ObrazkiAppSvgImage.id == id)

        delete_svg_files(query[0].name)

        db.query(models.ObrazkiAppSvgImage).filter(models.ObrazkiAppSvgImage.id == id).delete()
        db.commit()

    return {"Images deleted": id_lst}


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
