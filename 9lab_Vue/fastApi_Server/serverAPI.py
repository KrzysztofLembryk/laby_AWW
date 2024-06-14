from fastapi import FastAPI
from typing import List, Dict
import json
import random
from datetime import datetime
import asyncio
import time

app = FastAPI()


def svg_to_string(svg):
    svg_string = f'<svg width="{svg["width"]}" height="{svg["height"]}">'
    for rect in svg["rects"]:
        svg_string += f'<rect x="{rect["x1"]}" y="{rect["y1"]}" width="{rect["width"]}" height="{rect["height"]}" fill="{rect["fill"]}" stroke="{rect["stroke"]}" stroke-width="{rect["strokeWidth"]}" />'
    svg_string += '</svg>'
    return svg_string

def too_big_svg():
    svg = {}
    svg["width"] = 250
    svg["height"] = 250
    svg["rects"] = []
    

    for i in range(1, random.randint(10,200)):
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
                                "stroke": "",
                                "strokeWidth": 0
                            })

    return svg_to_string(svg)


@app.get("/randomImg")
async def random_img():
    return json.dumps(too_big_svg())

@app.get("/imgLst")
async def img_lst():
    images = []
    random.seed(datetime.now().timestamp())
    for i in range(1, random.randint(2, 20)):
        svg = too_big_svg()
        images.append(svg)
    return images