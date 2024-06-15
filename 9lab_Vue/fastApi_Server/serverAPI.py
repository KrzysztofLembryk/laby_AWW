from fastapi import FastAPI, HTTPException 
from typing import List, Dict
import json
import random
from datetime import datetime
import asyncio
import time
import constants


app = FastAPI()

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
    i = random.randint(1, 11)
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
    i = 0
    set_of_ids = set()
    while i < 5:
        num = random.randint(0, nbr_of_imgs - 1)
        if num not in set_of_ids:
            images.append({"id": num, "svg": constants.arr_of_imgs[num]})
            set_of_ids.add(num)
            i += 1
    # random.seed(datetime.now().timestamp())
    # for i in range(1, random.randint(2, 20)):
    #     svg = too_big_svg()
    #     images.append(svg)
    return images