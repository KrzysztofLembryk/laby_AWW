
export class SVG_Image
{
    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;
    private _rect_lst: string[];

    constructor(x: number, y: number, width: number, height: number)
    {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._rect_lst = [];
    }

    add_rnadom_rect()
    {
        let x: number = Math.floor(Math.random() * this._width);
        let y: number = Math.floor(Math.random() * this._height);
        let width: number = Math.floor(Math.random() * (this._width - x));
        let height: number = Math.floor(Math.random() * (this._height - y));
        let color: string = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        this.add_rect(x, y, width, height, color);
    }

    add_rect(x: number, y: number, width: number, height: number, color: string)
    {
        this._rect_lst.push(`<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${color}"/>`);
    }

    get_svg(): string
    {
        let svg: string = `<svg width="${this._width}" height="${this._height}">`;
        for(let rect of this._rect_lst)
        {
            svg += rect;
        }
        svg += "</svg>";
        return svg;
    }
}