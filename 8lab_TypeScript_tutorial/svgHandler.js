var rectIdToRemove = -1;
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
        this.id = 0;
        this.fill = "black";
        this.stroke = "";
        this.strokeWidth = 0;
        this.clickedHandler = new ClickedOn();
        this.x1 = x1;
        this.y1 = y1;
        if (x2 <= x1) {
            x2 = x1 + 10;
        }
        if (y2 <= y1) {
            y2 = y1 + 10;
        }
        this.width = x2 - x1;
        this.height = y2 - y1;
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
        var svg = "<svg width=\"".concat(this.width, "\" height=\"").concat(this.height, "\" style=\"border:1px solid black\">");
        for (var i = 0; i < this.rects.length; i++) {
            svg += this.rects[i].toString();
            svg += "\n";
        }
        svg += "</svg>";
        return svg;
    };
    return SVGHandler;
}());
var svgImages = [];
function handleFormSubmit() {
    // event.preventDefault();
    var form = document.forms["rectangleForm"];
    // let svgName = form["name"].value;
    var x1 = form["x1"].value;
    var y1 = form["y1"].value;
    var x2 = form["x2"].value;
    var y2 = form["y2"].value;
    var fill = form["fill"].value;
    var stroke = form["stroke"].value;
    var strokeWidth = form["stroke_width"].value;
    var rect = new Rectangle(parseInt(x1), parseInt(y1), parseInt(x2), parseInt(y2), fill, stroke, parseInt(strokeWidth));
    var svg = new SVGHandler("svg1", 300, 300, []);
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
