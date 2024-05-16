from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from fastapi import FastAPI, Depends 
from .database import Base, engine, SessionLocal
from sqlalchemy.orm import Session 
from typing import List, Dict
import json
from . import models
import random
from datetime import datetime
from fastapi import HTTPException 
import asyncio

app = FastAPI()
Base.metadata.create_all(bind=engine)

def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


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
                                "x1": x1,
                                "y1": y1,
                                "width": width,
                                "height": height,
                                "fill": color,
                                "stroke": "",
                                "strokeWidth": 0
                            })
    return svg

def ret_random_good_svg(images):
    random_number = random.randint(0, len(images) - 1)
    image = images[random_number]
    return {"width": image.width, "height": image.height, "rects": json.loads(image.svg)}

async def lengthy_generating_svg(images):
    await asyncio.sleep(5)
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
        return json.dumps(await lengthy_generating_svg(images))
    elif (random_number == 2):
        return ret_500_error()
    else:
        # Rozpatrzyc przypadek gdy zero svg obrazkow
        return json.dumps(ret_random_good_svg(images))


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

def get_recent_elements(db: Session):
    recent_elements = db.query(models.SvgImage).order_by(models.SvgImage.id.desc()).limit(5).all()
    return [{"width": image.width, "height": image.height, "rects": json.loads(image.svg)}  for image in recent_elements]

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int, db: Session = Depends(get_db)):
    await manager.connect(websocket)
    try:
        while True:
            if client_id == 1:
                svg_imgs = get_recent_elements(db)
                await manager.broadcast(json.dumps(svg_imgs))
            else:
                data = await websocket.receive_text()
                svg_imgs = get_recent_elements(db)
                await manager.send_personal_message(json.dumps(svg_imgs), websocket)
            # await manager.broadcast(json.dumps(svg_imgs))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        # await manager.broadcast(f"Client #{client_id} left the chat")


@app.websocket("/save")
async def save(websocket: WebSocket, db: Session = Depends(get_db)):

    await manager.connect(websocket)
    try:
        while True:
            data_json = await websocket.receive_text()
            data_json = json.loads(data_json)

            svg_image = models.SvgImage(name=data_json["name"], width=data_json["width"], height=data_json["height"], svg=json.dumps(data_json["rects"]))
            db.add(svg_image)
            db.commit()

            svg_imgs = get_recent_elements(db)
            await manager.broadcast(json.dumps(svg_imgs))

    except WebSocketDisconnect:
        manager.disconnect(websocket)


