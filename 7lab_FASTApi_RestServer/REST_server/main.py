from typing import Annotated, List
from pydantic import BaseModel
from fastapi import FastAPI, Form
from collections import Counter

app = FastAPI()

class Image(BaseModel):
    id: int
    name: str
    path: str
    tags: List[str]

@app.get("/")
async def root():
    return {"message": "Hello World"}

images = [
    Image(id=1, tags=['tag1', 'tag2']),
    Image(id=2, tags=['tag2', 'tag3']),
    # Add more images as needed
]

@app.get("/tag")
def list_tags():
    tag_counter = Counter(tag for image in images for tag in image.tags)
    return dict(tag_counter)