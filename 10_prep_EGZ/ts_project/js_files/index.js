"use strict";
class Rect {
    constructor(x, y, width, height, color) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._color = color;
    }
    get x() {
        return this._x.toString();
    }
    get y() {
        return this._y.toString();
    }
    get width() {
        return this._width.toString();
    }
    get height() {
        return this._height.toString();
    }
    get color() {
        return this._color;
    }
    toString() {
        return `<rect x="${this._x}" y="${this._y}" width="${this._width}" height="${this._height}" fill="${this._color}" />`;
    }
}
class SVG_Image {
    constructor(width, height) {
        this._width = width;
        this._height = height;
        this._rect_lst = [];
        this._chosen_rect_id = -1;
    }
    get chosen_rect_id() {
        return this._chosen_rect_id;
    }
    set chosen_rect_id(value) {
        this._chosen_rect_id = value;
    }
    get width() {
        return this._width.toString();
    }
    get height() {
        return this._height.toString();
    }
    add_rect(x, y, width, height, color) {
        this._rect_lst.push(new Rect(x, y, width, height, color));
    }
    add_random_rect() {
        let x = Math.floor(Math.random() * this._width);
        let y = Math.floor(Math.random() * this._height);
        let width = Math.floor(Math.random() * (this._width - x));
        let height = Math.floor(Math.random() * (this._height - y));
        let color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        this.add_rect(x, y, width, height, color);
    }
    get_svg() {
        let svg = `<svg width="${this._width}" height="${this._height}">`;
        for (let rect of this._rect_lst) {
            svg += rect.toString();
        }
        svg += "</svg>";
        return svg;
    }
    get rect_lst() {
        return this._rect_lst;
    }
}
let lst_of_imgs = [];
function show_imgs() {
    // albo ! zeby powiedziec kompilatorowi ze to na pewno nie jest null
    // albo musimy zrobić ifa sprawdzającego czy to nie jest null
    let imgs_div = document.getElementById("imgs_div");
    // Usuwamy wszystkie dzieci z diva
    imgs_div.innerHTML = "";
    if (lst_of_imgs.length == 0) {
        return;
    }
    let id = 0;
    for (let img of lst_of_imgs) {
        let newSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        newSVG.setAttribute("width", img.width);
        newSVG.setAttribute("height", img.height);
        newSVG.setAttribute("style", "border: 1px solid black; margin: 5px;");
        newSVG.setAttribute("id", "svg" + id.toString());
        let rect_id = 0;
        for (let rect of img.rect_lst) {
            let rect_elem = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect_elem.setAttribute('x', rect.x);
            rect_elem.setAttribute('y', rect.y);
            rect_elem.setAttribute('width', rect.width);
            rect_elem.setAttribute('height', rect.height);
            rect_elem.setAttribute('fill', rect.color);
            // Potrzebne zeby rect wiedzial w ktorym svg jest i ktory w tym 
            // svg ma id, zeby moc zapewnic ze np. tylko jeden rect moze byc 
            // zaznaczony w danym svg
            rect_elem.setAttribute('parent_svg_id', id.toString());
            rect_elem.setAttribute('my_id', rect_id.toString());
            rect_elem.onclick = function () {
                // Klasa SVG_Image pamieta ktory rect jest w niej klikniety
                // dzieki temu mozemy zmieniac kolor tylko jednego recta
                let svg_id = parseInt(rect_elem.getAttribute("parent_svg_id"));
                if (lst_of_imgs[svg_id].chosen_rect_id === -1) {
                    rect_elem.setAttribute("stroke", "rgb(255, 0, 127)");
                    rect_elem.setAttribute("stroke-width", "2");
                    lst_of_imgs[svg_id].chosen_rect_id = parseInt(rect_elem.getAttribute("my_id"));
                }
                else if (lst_of_imgs[svg_id].chosen_rect_id === parseInt(rect_elem.getAttribute("my_id"))) {
                    rect_elem.removeAttribute("stroke");
                    rect_elem.removeAttribute("stroke-width");
                    lst_of_imgs[svg_id].chosen_rect_id = -1;
                }
            };
            rect_elem.ondblclick = function () {
                let svg_id = parseInt(rect_elem.getAttribute("parent_svg_id"));
                let rect_id = parseInt(rect_elem.getAttribute("my_id"));
                if (lst_of_imgs[svg_id].chosen_rect_id === rect_id) {
                    lst_of_imgs[svg_id].rect_lst.splice(rect_id, 1);
                    lst_of_imgs[svg_id].chosen_rect_id = -1;
                    show_imgs();
                }
            };
            newSVG.appendChild(rect_elem);
            rect_id += 1;
        }
        imgs_div.appendChild(newSVG);
        id += 1;
    }
}
function handle_form(event) {
    event.preventDefault();
    let form = event.target;
    let width = form.width.value;
    let height = form.height.value;
    let img = new SVG_Image(parseInt(width), parseInt(height));
    img.add_random_rect();
    img.add_random_rect();
    img.add_random_rect();
    lst_of_imgs.push(img);
    show_imgs();
    form.reset();
}
function clear_imgs() {
    lst_of_imgs = [];
    show_imgs();
}
let reset_button = document.getElementById("reset_btn");
reset_button === null || reset_button === void 0 ? void 0 : reset_button.addEventListener("click", clear_imgs);
let first_form_elem = document.querySelector("form");
if (first_form_elem) {
    first_form_elem.addEventListener("submit", handle_form);
}
