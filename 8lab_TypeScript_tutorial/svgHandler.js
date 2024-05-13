var _a;
var rectIdToRemove = -1;
var colorChosen = "black";
function handleColorChoosing() {
    var form = document.forms["colorForm"];
    if (form === null)
        return;
    var pickedColor = form["pickedColor"];
    if (pickedColor === null)
        return;
    colorChosen = pickedColor.value;
}
function removeClicked() {
    if (rectIdToRemove === -1)
        return;
    svgImages[0].rects[rectIdToRemove].clickedHandler.isClicked = false;
    rectIdToRemove = -1;
    document.querySelector("#chosenRectID").innerHTML = "No rect chosen";
    document.querySelector("#resultSVG").innerHTML = svgImages[0].toString();
}
function setRectRemoveID(id) {
    rectIdToRemove = id;
    if (rectIdToRemove === -1)
        document.querySelector("#chosenRectID").innerHTML = "No rect chosen";
    else {
        for (var i = 0; i < svgImages[0].rects.length; i++) {
            svgImages[0].rects[i].clickedHandler.isClicked = false;
        }
        svgImages[0].rects[rectIdToRemove].clickedHandler.isClicked = true;
        document.querySelector("#chosenRectID").innerHTML = "Chosen rect ID: " + rectIdToRemove.toString();
        document.querySelector("#resultSVG").innerHTML = svgImages[0].toString();
    }
}
function removeAllRectangles() {
    svgImages[0].rects = [];
    document.querySelector("#resultSVG").innerHTML = svgImages[0].toString();
}
var ClickedOn = /** @class */ (function () {
    function ClickedOn() {
        this.stroke = "#ff1dcf";
        this.strokeWidth = 3;
        this.isClicked = false;
    }
    ClickedOn.prototype.getStroke = function () {
        return this.stroke;
    };
    ClickedOn.prototype.getStrokeWidth = function () {
        return this.strokeWidth;
    };
    return ClickedOn;
}());
var Rectangle = /** @class */ (function () {
    function Rectangle(x1, y1, x2, y2, fill, stroke, strokeWidth) {
        if (stroke === void 0) { stroke = ""; }
        if (strokeWidth === void 0) { strokeWidth = 0; }
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
    Rectangle.prototype.toString = function () {
        if (this.clickedHandler.isClicked)
            return "<rect x=\"".concat(this.x1, "\" y=\"").concat(this.y1, "\" width=\"").concat(this.width, "\" height=\"").concat(this.height, "\" fill=\"").concat(this.fill, "\" stroke=\"").concat(this.clickedHandler.getStroke(), "\" stroke-width=\"").concat(this.clickedHandler.getStrokeWidth(), "\" onclick=\"setRectRemoveID(").concat(this.id, ")\" />");
        return "<rect x=\"".concat(this.x1, "\" y=\"").concat(this.y1, "\" width=\"").concat(this.width, "\" height=\"").concat(this.height, "\" fill=\"").concat(this.fill, "\" stroke=\"").concat(this.stroke, "\" stroke-width=\"").concat(this.strokeWidth, "\" onclick=\"setRectRemoveID(").concat(this.id, ")\" />");
    };
    return Rectangle;
}());
var mouseClicked = false;
var boundClientRect = (_a = document.getElementById("resultSVG")) === null || _a === void 0 ? void 0 : _a.getClientRects();
var offset_Y = 320; //boundClientRect[0].top;
// Do onmousedown, onmousemove, onmouseup w svg trzeba przekazać event!!!
function onMouseDownHandler(event) {
    var mouseX = event.clientX;
    var mouseY = event.clientY - offset_Y;
    mouseClicked = true;
    var rect = new Rectangle(mouseX, mouseY, mouseX, mouseY, colorChosen);
    svgImages[0].addRectangle(rect);
    console.log(svgImages[0].toString());
}
function onMouseMoveHandler(event) {
    var mouseX = event.clientX;
    var mouseY = event.clientY - offset_Y;
    if (mouseClicked) {
        var rect = svgImages[0].rects[svgImages[0].rects.length - 1];
        rect.width = Math.abs(rect.x1 - mouseX);
        rect.height = Math.abs(rect.y1 - mouseY);
        rect.x1 = Math.min(rect.x1, mouseX);
        rect.y1 = Math.min(rect.y1, mouseY);
        document.querySelector("#resultSVG").innerHTML = svgImages[0].toString();
    }
}
function onMouseUpHandler(event) {
    var mouseX = event.clientX;
    var mouseY = event.clientY - offset_Y;
    mouseClicked = false;
    var rect = svgImages[0].rects[svgImages[0].rects.length - 1];
    if (rect.x1 === mouseX && rect.y1 === mouseY) {
        svgImages[0].removeRectangle(svgImages[0].rects.length - 1);
        return;
    }
    rect.width = Math.abs(rect.x1 - mouseX);
    rect.height = Math.abs(rect.y1 - mouseY);
    rect.x1 = Math.min(rect.x1, mouseX);
    rect.y1 = Math.min(rect.y1, mouseY);
    document.querySelector("#resultSVG").innerHTML = svgImages[0].toString();
}
var SVGHandler = /** @class */ (function () {
    function SVGHandler(name, width, height, rects) {
        this.rects = [];
        this.name = name;
        this.width = width;
        this.height = height;
        this.rects = rects;
    }
    SVGHandler.prototype.addRectangle = function (rect) {
        rect.id = this.rects.length;
        this.rects.push(rect);
    };
    SVGHandler.prototype.updateRectIds = function () {
        for (var i = 0; i < this.rects.length; i++) {
            this.rects[i].id = i;
        }
    };
    SVGHandler.prototype.removeRectangle = function (id) {
        for (var i = 0; i < this.rects.length; i++) {
            if (i === id) {
                this.rects.splice(i, 1);
                this.updateRectIds();
                return true;
            }
        }
        return false;
    };
    SVGHandler.prototype.toString = function () {
        var svg = "<svg width=\"".concat(this.width, "\" height=\"").concat(this.height, "\" style=\"border:1px solid black\" id=\"svgHeader\" onmousedown=\"onMouseDownHandler(event)\" onmousemove=\"onMouseMoveHandler(event)\" onmouseup=\"onMouseUpHandler(event)\">");
        for (var i = 0; i < this.rects.length; i++) {
            svg += this.rects[i].toString();
            svg += "\n";
        }
        svg += "</svg>";
        return svg;
    };
    SVGHandler.prototype.toJson = function () {
        var json = "[";
        for (var i = 0; i < this.rects.length; i++) {
            json += "{\"x1\": ".concat(this.rects[i].x1, ",\"y1\": ").concat(this.rects[i].y1, ",\"width\": ").concat(this.rects[i].width, ",\"height\": ").concat(this.rects[i].height, ",\"fill\": \"").concat(this.rects[i].fill, "\",\"stroke\": \"").concat(this.rects[i].stroke, "\",\"strokeWidth\": ").concat(this.rects[i].strokeWidth, "}");
            if (i !== this.rects.length - 1)
                json += ",";
        }
        json += "]";
        return json;
    };
    return SVGHandler;
}());
var svgImages = [];
function handleFormSubmit() {
    var form = document.forms["rectangleForm"];
    var x1 = form["x1"].value;
    var y1 = form["y1"].value;
    var x2 = form["x2"].value;
    var y2 = form["y2"].value;
    var fill = form["fill"].value;
    var stroke = form["stroke"].value;
    var strokeWidth = form["stroke_width"].value;
    var rect = new Rectangle(parseInt(x1), parseInt(y1), parseInt(x2), parseInt(y2), fill, stroke, parseInt(strokeWidth));
    var svg = new SVGHandler("svg1", 250, 200, []);
    if (svgImages.length === 0)
        svgImages.push(svg);
    svgImages[0].addRectangle(rect);
    document.querySelector("#resultSVG").innerHTML = svgImages[0].toString();
}
function removeRectangle() {
    if (rectIdToRemove === -1) {
        document.querySelector("#chosenRectID").innerHTML = "No rect chosen";
        return;
    }
    svgImages[0].removeRectangle(rectIdToRemove);
    rectIdToRemove = -1;
    document.querySelector("#resultSVG").innerHTML = svgImages[0].toString();
    document.querySelector("#chosenRectID").innerHTML = "No rect chosen";
}
function drawRectangle(svgElement, color) {
    var rect = null;
    var startX, startY;
    svgElement.addEventListener('mousedown', function (e) {
        startX = e.clientX;
        startY = e.clientY;
        rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('fill', color);
        svgElement.appendChild(rect);
    });
    svgElement.addEventListener('mousemove', function (e) {
        if (!rect)
            return;
        rect.setAttribute('x', String(Math.min(e.clientX, startX)));
        rect.setAttribute('y', String(Math.min(e.clientY, startY)));
        rect.setAttribute('width', String(Math.abs(e.clientX - startX)));
        rect.setAttribute('height', String(Math.abs(e.clientY - startY)));
    });
    svgElement.addEventListener('mouseup', function () {
        rect = null;
    });
}
function generateRandomFilename() {
    var filename = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 8; i++) {
        filename += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return filename;
}
// async function postData(final_json): Promise<void> {
//     const response = await fetch('http://localhost:8000/save', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: final_json});
//     const data = await response.json();
//     console.log(data);
// }
function saveSVG() {
    var svg_name = generateRandomFilename();
    var rects = svgImages[0].toJson();
    var lst = [];
    for (var i = 0; i < svgImages[0].rects.length; i++) {
        lst.push({ "x1": svgImages[0].rects[i].x1, "y1": svgImages[0].rects[i].y1, "width": svgImages[0].rects[i].width, "height": svgImages[0].rects[i].height, "fill": svgImages[0].rects[i].fill, "stroke": svgImages[0].rects[i].stroke, "strokeWidth": svgImages[0].rects[i].strokeWidth });
    }
    var final_json = { "name": svg_name, "width": svgImages[0].width, "height": svgImages[0].height, "rects": lst };
    // let x = {"name": svg_name, "width": 260, "height": 69, "rects": [{"x1": 10, "y1": 69}]};
    var response = fetch('http://127.0.0.1:8000/save', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }, body: JSON.stringify(final_json)
    });
    console.log(final_json);
    return;
}
