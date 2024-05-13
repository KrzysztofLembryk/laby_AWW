"use strict";
var _a;
let rectIdToRemove = -1;
let colorChosen = "black";
function handleColorChoosing() {
    let form = document.querySelector("#colorForm");
    // let form = document.forms["colorForm"];
    if (form === null)
        return;
    let pickedColor = form["pickedColor"];
    if (pickedColor === null)
        return;
    colorChosen = pickedColor.value;
}
function removeClicked() {
    if (rectIdToRemove === -1)
        return;
    svgImages[0].rects[rectIdToRemove].clickedHandler.isClicked = false;
    rectIdToRemove = -1;
    let chosenRect = document.querySelector("#chosenRectID");
    if (chosenRect !== null)
        chosenRect.innerHTML = "No rect chosen";
    // document!.querySelector("#chosenRectID").innerHTML = "No rect chosen"
    let resultSVG = document.querySelector("#resultSVG");
    if (resultSVG !== null)
        resultSVG.innerHTML = svgImages[0].toString();
    // document!.querySelector("#resultSVG").innerHTML = svgImages[0].toString();
}
function setRectRemoveID(id) {
    rectIdToRemove = id;
    if (rectIdToRemove === -1) {
        let chosenRect = document.querySelector("#chosenRectID");
        chosenRect.innerHTML = "No rect chosen";
    }
    else {
        for (let i = 0; i < svgImages[0].rects.length; i++) {
            svgImages[0].rects[i].clickedHandler.isClicked = false;
        }
        svgImages[0].rects[rectIdToRemove].clickedHandler.isClicked = true;
        let chosenRect = document.querySelector("#chosenRectID");
        chosenRect.innerHTML = "Chosen rect ID: " + rectIdToRemove.toString();
        // document.querySelector("#chosenRectID").innerHTML = "Chosen rect ID: " + rectIdToRemove.toString();
        let resultSVG = document.querySelector("#resultSVG");
        resultSVG.innerHTML = svgImages[0].toString();
        // document.querySelector("#resultSVG").innerHTML = svgImages[0].toString();
    }
}
function removeAllRectangles() {
    svgImages[0].rects = [];
    let resultSVG = document.querySelector("#resultSVG");
    resultSVG.innerHTML = svgImages[0].toString();
    // document.querySelector("#resultSVG").innerHTML = svgImages[0].toString();
}
class ClickedOn {
    constructor() {
        this.stroke = "#ff1dcf";
        this.strokeWidth = 3;
        this.isClicked = false;
    }
    getStroke() {
        return this.stroke;
    }
    getStrokeWidth() {
        return this.strokeWidth;
    }
}
class Rectangle {
    constructor(x1, y1, x2, y2, fill, stroke = "", strokeWidth = 0) {
        this.id = 0;
        this.clickedHandler = new ClickedOn();
        this.x1 = x1;
        this.y1 = y1;
        this.width = Math.abs(x2 - x1);
        this.height = Math.abs(y2 - y1);
        this.fill = fill;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
    }
    toString() {
        if (this.clickedHandler.isClicked)
            return `<rect x="${this.x1}" y="${this.y1}" width="${this.width}" height="${this.height}" fill="${this.fill}" stroke="${this.clickedHandler.getStroke()}" stroke-width="${this.clickedHandler.getStrokeWidth()}" onclick="setRectRemoveID(${this.id})" />`;
        return `<rect x="${this.x1}" y="${this.y1}" width="${this.width}" height="${this.height}" fill="${this.fill}" stroke="${this.stroke}" stroke-width="${this.strokeWidth}" onclick="setRectRemoveID(${this.id})" />`;
    }
}
let mouseClicked = false;
let boundClientRect = (_a = document.getElementById("resultSVG")) === null || _a === void 0 ? void 0 : _a.getClientRects();
let offset_Y = 320; //boundClientRect[0].top;
// Do onmousedown, onmousemove, onmouseup w svg trzeba przekazać event!!!
function onMouseDownHandler(event) {
    let mouseX = event.clientX;
    let mouseY = event.clientY - offset_Y;
    mouseClicked = true;
    let rect = new Rectangle(mouseX, mouseY, mouseX, mouseY, colorChosen);
    svgImages[0].addRectangle(rect);
    console.log(svgImages[0].toString());
}
function onMouseMoveHandler(event) {
    let mouseX = event.clientX;
    let mouseY = event.clientY - offset_Y;
    if (mouseClicked) {
        let rect = svgImages[0].rects[svgImages[0].rects.length - 1];
        rect.width = Math.abs(rect.x1 - mouseX);
        rect.height = Math.abs(rect.y1 - mouseY);
        rect.x1 = Math.min(rect.x1, mouseX);
        rect.y1 = Math.min(rect.y1, mouseY);
        let resultSVG = document.querySelector("#resultSVG");
        resultSVG.innerHTML = svgImages[0].toString();
        // document.querySelector("#resultSVG").innerHTML = svgImages[0].toString();
    }
}
function onMouseUpHandler(event) {
    let mouseX = event.clientX;
    let mouseY = event.clientY - offset_Y;
    mouseClicked = false;
    let rect = svgImages[0].rects[svgImages[0].rects.length - 1];
    if (rect.x1 === mouseX && rect.y1 === mouseY) {
        svgImages[0].removeRectangle(svgImages[0].rects.length - 1);
        return;
    }
    rect.width = Math.abs(rect.x1 - mouseX);
    rect.height = Math.abs(rect.y1 - mouseY);
    rect.x1 = Math.min(rect.x1, mouseX);
    rect.y1 = Math.min(rect.y1, mouseY);
    let resultSVG = document.querySelector("#resultSVG");
    resultSVG.innerHTML = svgImages[0].toString();
    // document.querySelector("#resultSVG").innerHTML = svgImages[0].toString();
}
class SVGHandler {
    constructor(name, width, height, rects) {
        this.rects = [];
        this.name = name;
        this.width = width;
        this.height = height;
        this.rects = rects;
    }
    addRectangle(rect) {
        rect.id = this.rects.length;
        this.rects.push(rect);
    }
    updateRectIds() {
        for (let i = 0; i < this.rects.length; i++) {
            this.rects[i].id = i;
        }
    }
    removeRectangle(id) {
        for (let i = 0; i < this.rects.length; i++) {
            if (i === id) {
                this.rects.splice(i, 1);
                this.updateRectIds();
                return true;
            }
        }
        return false;
    }
    toString() {
        let svg = `<svg width="${this.width}" height="${this.height}" style="border:1px solid black" id="svgHeader" onmousedown="onMouseDownHandler(event)" onmousemove="onMouseMoveHandler(event)" onmouseup="onMouseUpHandler(event)">`;
        for (let i = 0; i < this.rects.length; i++) {
            svg += this.rects[i].toString();
            svg += "\n";
        }
        svg += "</svg>";
        return svg;
    }
    toJson() {
        let json = "[";
        for (let i = 0; i < this.rects.length; i++) {
            json += `{"x1": ${this.rects[i].x1},"y1": ${this.rects[i].y1},"width": ${this.rects[i].width},"height": ${this.rects[i].height},"fill": "${this.rects[i].fill}","stroke": "${this.rects[i].stroke}","strokeWidth": ${this.rects[i].strokeWidth}}`;
            if (i !== this.rects.length - 1)
                json += ",";
        }
        json += "]";
        return json;
    }
}
let svgImages = [];
function handleFormSubmit() {
    let form = document.querySelector("#rectangleForm");
    let x1 = form["x1"].value;
    let y1 = form["y1"].value;
    let x2 = form["x2"].value;
    let y2 = form["y2"].value;
    let fill = form["fill"].value;
    let stroke = form["stroke"].value;
    let strokeWidth = form["stroke_width"].value;
    let rect = new Rectangle(parseInt(x1), parseInt(y1), parseInt(x2), parseInt(y2), fill, stroke, parseInt(strokeWidth));
    let svg = new SVGHandler("svg1", 250, 200, []);
    if (svgImages.length === 0)
        svgImages.push(svg);
    svgImages[0].addRectangle(rect);
    let resultSVG = document.querySelector("#resultSVG");
    resultSVG.innerHTML = svgImages[0].toString();
    // document.querySelector("#resultSVG").innerHTML = svgImages[0].toString();
}
function removeRectangle() {
    if (rectIdToRemove === -1) {
        let chosenRect = document.querySelector("#chosenRectID");
        chosenRect.innerHTML = "No rect chosen";
        return;
    }
    svgImages[0].removeRectangle(rectIdToRemove);
    rectIdToRemove = -1;
    let resultSVG = document.querySelector("#resultSVG");
    resultSVG.innerHTML = svgImages[0].toString();
    // document.querySelector("#resultSVG").innerHTML = svgImages[0].toString();
    let chosenRect = document.querySelector("#chosenRectID");
    chosenRect.innerHTML = "No rect chosen";
    // document.querySelector("#chosenRectID").innerHTML = "No rect chosen";
}
function drawRectangle(svgElement, color) {
    let rect = null;
    let startX, startY;
    svgElement.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        startY = e.clientY;
        rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('fill', color);
        svgElement.appendChild(rect);
    });
    svgElement.addEventListener('mousemove', (e) => {
        if (!rect)
            return;
        rect.setAttribute('x', String(Math.min(e.clientX, startX)));
        rect.setAttribute('y', String(Math.min(e.clientY, startY)));
        rect.setAttribute('width', String(Math.abs(e.clientX - startX)));
        rect.setAttribute('height', String(Math.abs(e.clientY - startY)));
    });
    svgElement.addEventListener('mouseup', () => {
        rect = null;
    });
}
function generateRandomFilename() {
    let filename = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 8; i++) {
        filename += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return filename;
}
function saveSVG() {
    let svg_name = generateRandomFilename();
    let lst = [];
    for (let i = 0; i < svgImages[0].rects.length; i++) {
        lst.push({ "x1": svgImages[0].rects[i].x1, "y1": svgImages[0].rects[i].y1, "width": svgImages[0].rects[i].width, "height": svgImages[0].rects[i].height, "fill": svgImages[0].rects[i].fill, "stroke": svgImages[0].rects[i].stroke, "strokeWidth": svgImages[0].rects[i].strokeWidth });
    }
    let final_json = { "name": svg_name, "width": svgImages[0].width, "height": svgImages[0].height, "rects": lst };
    const response = fetch('http://127.0.0.1:8000/save', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }, body: JSON.stringify(final_json)
    });
    return;
}
