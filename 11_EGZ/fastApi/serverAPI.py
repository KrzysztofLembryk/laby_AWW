from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Depends
from typing import List, Dict
import json
import random
from datetime import datetime
import asyncio
import time
from . import constants
from .database import Base, engine, SessionLocal
from sqlalchemy.orm import Session 
from . import models


app = FastAPI()
Base.metadata.create_all(bind=engine)

def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

@app.get("/imgLssst")
async def img_lssst(db: Session = Depends(get_db)):
    images = db.query(models.SvgImage).all()
    return {image.name:{"width": image.width, "height": image.height, "rects": json.loads(image.svg)}  for image in images}

def svg_to_string(svg):
    svg_string = f'<svg width="{svg["width"]}" height="{svg["height"]}">'
    for rect in svg["rects"]:
        svg_string += f'<rect x="{rect["x1"]}" y="{rect["y1"]}" width="{rect["width"]}" height="{rect["height"]}" fill="{rect["fill"]}"" />'
    svg_string += '</svg>'
    return svg_string

def too_big_svg():
    svg = {}
    svg["width"] = 250
    svg["height"] = 250
    svg["rects"] = []
    

    for i in range(1, random.randint(5,10)):
        x1 = random.randint(0, 198)
        y1 = random.randint(0, 198)
        x2 = random.randint(x1 + 1, 200)
        y2 = random.randint(y1 + 1, 200)
        width = x2 - x1
        height = y2 - y1
        color = "#"+''.join([random.choice('0123456789ABCDEF') for j in range(6)])
        svg["rects"].append(
                            {
                                "x1": x1,
                                "y1": y1,
                                "width": width,
                                "height": height,
                                "fill": color,
                            })

    return svg_to_string(svg)


@app.get("/img/{id}")
async def id_img(id: int):
    if id >= len(constants.arr_of_imgs) or id < 0:
        raise HTTPException(status_code=404)
    i = random.randint(0, 11)
    if i <= 4:
        return constants.arr_of_imgs[id]
    elif i <= 7:
        await asyncio.sleep(5)
        return constants.arr_of_imgs[id]
    else:
        raise HTTPException(status_code=404, detail="random Error")


@app.get("/imgLst")
async def img_lst():
    images = []
    nbr_of_imgs = len(constants.arr_of_imgs)

    random.seed(datetime.now().timestamp())
    n = len(constants.arr_of_imgs)
    i = 0
    set_of_ids = set()
    while i < n:
        images.append({"id": i, "svg": constants.arr_of_imgs[i]})
        i += 1
        # num = random.randint(0, nbr_of_imgs - 1)
        # if num not in set_of_ids:
        #     images.append({"id": num, "svg": constants.arr_of_imgs[num]})
        #     set_of_ids.add(num)
        #     i += 1
    return images

# websocket
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/addImg")
async def add_img():
    img = too_big_svg()
    constants.arr_of_imgs.append(img)

    await manager.broadcast(str(len(constants.arr_of_imgs)))

    return "Image added successfully"