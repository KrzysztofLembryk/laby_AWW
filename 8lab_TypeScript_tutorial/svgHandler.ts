class Rectangle 
{
    id: number = 0;
    x1: number;
    y1: number;
    width: number;
    height: number;
    fill: string = "black";
    stroke: string = "pink";
    strokeWidth: number = 2;

    constructor(x1: number, y1: number, x2: number, y2: number, fill: string, stroke: string, strokeWidth: number) {
        this.x1 = x1;
        this.y1 = y1;
        if (x2 < x1)
        {
            x2 = x1 + 10;
        }
        if (y2 < y1)
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
        return `<rect x="${this.x1}" y="${this.y1}" width="${this.width}" height="${this.height}" fill="${this.fill}" stroke="${this.stroke}" stroke-width="${this.strokeWidth}" onclick="alert(${this.id})" />`;
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
        let svg = `<svg width="${this.width}" height="${this.height}">`;
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
    let svg = new SVGHandler("svg1", 100, 100, []);
    if (svgImages.length === 0)
        svgImages.push(svg);

    svgImages[0].addRectangle(rect);
    document.querySelector("#resultSVG").innerHTML = svgImages[0].toString();
}
