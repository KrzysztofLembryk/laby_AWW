let rectIdToRemove: number = -1;


function removeClicked(): void
{
    if (rectIdToRemove === -1)
        return;

    svgImages[0].rects[rectIdToRemove].clickedHandler.isClicked = false;
    rectIdToRemove = -1;

    document.querySelector("#chosenRectID").innerHTML = "No rect chosen" 
    document.querySelector("#resultSVG").innerHTML = svgImages[0].toString();
}

function setRectRemoveID(id: number): void
{
    rectIdToRemove = id;
    if (rectIdToRemove === -1)
        document.querySelector("#chosenRectID").innerHTML = "No rect chosen";
    else
    {
        for (let i = 0; i < svgImages[0].rects.length; i++)
        {
            svgImages[0].rects[i].clickedHandler.isClicked = false;
        }
        svgImages[0].rects[rectIdToRemove].clickedHandler.isClicked = true;

        document.querySelector("#chosenRectID").innerHTML = "Chosen rect ID: " + rectIdToRemove.toString();
        document.querySelector("#resultSVG").innerHTML = svgImages[0].toString();
    }
}

class ClickedOn
{
    isClicked: boolean;
    private stroke: string = "#ff1dcf";
    private strokeWidth: number = 3;

    constructor()
    {
        this.isClicked = false;
    }
    getStroke(): string
    {
        return this.stroke;
    }

    getStrokeWidth(): number
    {
        return this.strokeWidth;
    }
}


class Rectangle 
{
    id: number = 0;
    x1: number;
    y1: number;
    width: number;
    height: number;
    fill: string = "black";
    stroke: string = "";
    strokeWidth: number = 0;
    clickedHandler: ClickedOn = new ClickedOn();

    constructor(x1: number, y1: number, x2: number, y2: number, fill: string, stroke: string, strokeWidth: number) {
        this.x1 = x1;
        this.y1 = y1;
        if (x2 <= x1)
        {
            x2 = x1 + 10;
        }
        if (y2 <= y1)
        {
            y2 = y1 + 10;
        }
        this.width = x2 - x1;
        this.height = y2 - y1;
        this.fill = fill;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
    }

    toString(): string 
    {
        if (this.clickedHandler.isClicked)
            return `<rect x="${this.x1}" y="${this.y1}" width="${this.width}" height="${this.height}" fill="${this.fill}" stroke="${this.clickedHandler.getStroke()}" stroke-width="${this.clickedHandler.getStrokeWidth()}" onclick="setRectRemoveID(${this.id})" />`;

        return `<rect x="${this.x1}" y="${this.y1}" width="${this.width}" height="${this.height}" fill="${this.fill}" stroke="${this.stroke}" stroke-width="${this.strokeWidth}" onclick="setRectRemoveID(${this.id})" />`;
    }
}


class SVGHandler {
    name: string;
    width: number;
    height: number;
    rects: Rectangle[] = [];

    constructor(name: string, width: number, height: number, 
        rects: Rectangle[]) 
    {
        this.name = name;
        this.width = width;
        this.height = height;
        this.rects = rects;
    }
    
    addRectangle(rect: Rectangle): void 
    {
        rect.id = this.rects.length;
        this.rects.push(rect);
    }

    updateRectIds(): void
    {
        for (let i = 0; i < this.rects.length; i++)
        {
            this.rects[i].id = i;
        }
    }

    removeRectangle(id: number): boolean 
    {
        for (let i = 0 ; i < this.rects.length; i++)
        {
            if (i === id)
            {
                this.rects.splice(i, 1);
                this.updateRectIds();

                return true;
            }
        }
        return false;
    }

    toString(): string 
    {
        let svg = `<svg width="${this.width}" height="${this.height}" style="border:1px solid black">`;
        for (let i = 0; i < this.rects.length; i++)
        {
            svg += this.rects[i].toString();
            svg += "\n";
        }
        svg += "</svg>";
        return svg;
    }
}

let svgImages: SVGHandler[] = [];

function handleFormSubmit(): void 
{
    // event.preventDefault();
    let form = document.forms["rectangleForm"];
    // let svgName = form["name"].value;
    let x1 = form["x1"].value;
    let y1 = form["y1"].value;
    let x2 = form["x2"].value;
    let y2 = form["y2"].value;
    let fill = form["fill"].value;
    let stroke = form["stroke"].value;
    let strokeWidth = form["stroke_width"].value;

    let rect = new Rectangle(parseInt(x1), parseInt(y1), parseInt(x2), parseInt(y2), fill, stroke, parseInt(strokeWidth));
    let svg = new SVGHandler("svg1", 250, 250, []);
    if (svgImages.length === 0)
        svgImages.push(svg);

    svgImages[0].addRectangle(rect);
    document.querySelector("#resultSVG").innerHTML = svgImages[0].toString();
}



function removeRectangle(): void
{
    if (rectIdToRemove === -1)
    {
        document.querySelector("#chosenRectID").innerHTML = "No rect chosen";
        return;
    }
    svgImages[0].removeRectangle(rectIdToRemove);
    rectIdToRemove = -1;

    document.querySelector("#resultSVG").innerHTML = svgImages[0].toString();
    document.querySelector("#chosenRectID").innerHTML = "No rect chosen";
}
