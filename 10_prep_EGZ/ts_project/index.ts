class Rect
{
    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;
    private _color: string;

    constructor(x: number, y: number, width: number, height: number, color: string)
    {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._color = color;
    }

    public get x(): string
    {
        return this._x.toString();
    }

    public get y(): string
    {
        return this._y.toString();
    }

    public get width(): string
    {
        return this._width.toString();
    }

    public get height(): string
    {
        return this._height.toString();
    }

    public get color(): string
    {
        return this._color;
    }

    public toString(): string
    {
        return `<rect x="${this._x}" y="${this._y}" width="${this._width}" height="${this._height}" fill="${this._color}" />`;
    }
}

class SVG_Image
{
    private _width: number;
    private _height: number;
    private _rect_lst: Rect[];
    private _chosen_rect_id: number;

    constructor(width: number, height: number)
    {
        this._width = width;
        this._height = height;
        this._rect_lst = [];
        this._chosen_rect_id = -1;
    }

    public get chosen_rect_id(): number
    {
        return this._chosen_rect_id;
    }

    public set chosen_rect_id(value: number)
    {
        this._chosen_rect_id = value;
    }

    public get width(): string
    {
        return this._width.toString();
    }

    public get height(): string
    {
        return this._height.toString();
    }

    public add_rect(x: number, y: number, width: number, height: number, color: string)
    {
        this._rect_lst.push(new Rect(x, y, width, height, color));
    }

    public add_random_rect()
    {
        let x: number = Math.floor(Math.random() * this._width);
        let y: number = Math.floor(Math.random() * this._height);
        let width: number = Math.floor(Math.random() * (this._width - x));
        let height: number = Math.floor(Math.random() * (this._height - y));
        let color: string = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        this.add_rect(x, y, width, height, color);
    }

    public get_svg(): string
    {
        let svg: string = `<svg width="${this._width}" height="${this._height}">`;
        for(let rect of this._rect_lst)
        {
            svg += rect.toString();
        }
        svg += "</svg>";
        return svg;
    }

    public get rect_lst(): Rect[]
    {
        return this._rect_lst;
    }

}

let lst_of_imgs: SVG_Image[] = [];

function show_imgs()
{
    // albo ! zeby powiedziec kompilatorowi ze to na pewno nie jest null
    // albo musimy zrobić ifa sprawdzającego czy to nie jest null
    let imgs_div = document.getElementById("imgs_div")!;

    // Usuwamy wszystkie dzieci z diva
    imgs_div.innerHTML = "";
    if (lst_of_imgs.length == 0)
    {
        return;
    }
    let id = 0;
    for(let img of lst_of_imgs)
    {
        let newSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        newSVG.setAttribute("width", img.width);
        newSVG.setAttribute("height", img.height);
        newSVG.setAttribute("style", "border: 1px solid black; margin: 5px;");
        newSVG.setAttribute("id", "svg" + id.toString());

        let rect_id = 0;
        for (let rect of img.rect_lst)
        {
            let rect_elem = document.createElementNS("http://www.w3.org/2000/svg", "rect");

            rect_elem.setAttribute('x', rect.x);
            rect_elem.setAttribute('y', rect.y);
            rect_elem.setAttribute('width', rect.width);
            rect_elem.setAttribute('height', rect.height);
            rect_elem.setAttribute('fill', rect.color);

            // Potrzebne zeby rect wiedzial w ktorym svg jest i ktory w tym 
            // svg ma id, zeby moc zapewnic ze np. tylko jeden rect moze byc 
            // zaznaczony w danym svg
            rect_elem.setAttribute('parent_svg_id',id.toString());
            rect_elem.setAttribute('my_id',rect_id.toString());

            rect_elem.onclick = function() {
                // Klasa SVG_Image pamieta ktory rect jest w niej klikniety
                // dzieki temu mozemy zmieniac kolor tylko jednego recta
                let svg_id = parseInt(rect_elem.getAttribute("parent_svg_id")!);
                if (lst_of_imgs[svg_id].chosen_rect_id === -1)
                {
                    rect_elem.setAttribute("stroke", "rgb(255, 0, 127)"); 
                    rect_elem.setAttribute("stroke-width", "2");
                    lst_of_imgs[svg_id].chosen_rect_id = parseInt(rect_elem.getAttribute("my_id")!);
                }
                else if (lst_of_imgs[svg_id].chosen_rect_id === parseInt(rect_elem.getAttribute("my_id")!))
                {
                    rect_elem.removeAttribute("stroke");
                    rect_elem.removeAttribute("stroke-width");
                    lst_of_imgs[svg_id].chosen_rect_id = -1;
                }
            }

            rect_elem.ondblclick = function() {
                let svg_id = parseInt(rect_elem.getAttribute("parent_svg_id")!);
                let rect_id = parseInt(rect_elem.getAttribute("my_id")!);

                if (lst_of_imgs[svg_id].chosen_rect_id === rect_id)
                {
                    lst_of_imgs[svg_id].rect_lst.splice(rect_id, 1);
                    lst_of_imgs[svg_id].chosen_rect_id = -1;

                    show_imgs();
                }
            }

            newSVG.appendChild(rect_elem);
            rect_id += 1;
        }
        imgs_div.appendChild(newSVG);
        id += 1;
    }
}

function handle_form(event: Event)
{
    event.preventDefault();
    let form = <HTMLFormElement>event.target;
    let width = form.width.value;
    let height = form.height.value;
    let img = new SVG_Image(parseInt(width), parseInt(height));
    img.add_random_rect();
    img.add_random_rect();
    img.add_random_rect();
    lst_of_imgs.push(img);
    show_imgs();
}

function clear_imgs()
{
    lst_of_imgs = [];
    show_imgs();
}

let reset_button = document.getElementById("reset_btn");
reset_button?.addEventListener("click", clear_imgs);

let first_form_elem = document.querySelector("form");

if (first_form_elem)
{
    first_form_elem.addEventListener("submit", handle_form);
}

