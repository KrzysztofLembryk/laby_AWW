"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let serverUrl = "http://127.0.0.1:8000";
class ImageLoader {
    constructor() {
        this.container = document.getElementById("svgList");
    }
    _createOneSpinner(i) {
        let spinner = document.createElement("img");
        spinner.className = "spinner" + i;
        spinner.src = "spinner.gif";
        spinner.width = 150;
        spinner.height = 150;
        return spinner;
    }
    createSpinners() {
        var _a;
        for (let i = 0; i < ImageLoader.nbr_of_imgs; i++) {
            let svg_div = document.createElement("div");
            svg_div.className = "svg" + i;
            // svg_div.style.border = "1px solid black";
            // svg_div.style.width = "300px";
            let spinner = this._createOneSpinner(i);
            let p = document.createElement("p");
            p.innerText = "image " + i + ":";
            svg_div.appendChild(p);
            svg_div.appendChild(spinner);
            (_a = this.container) === null || _a === void 0 ? void 0 : _a.appendChild(svg_div);
            // this.container?.appendChild(document.createElement("br"));
        }
    }
    _make_svg_str_from_json(svg_json) {
        let svg = `<svg width="${svg_json.width}" height="${svg_json.height}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid black">\n`;
        for (let rect in svg_json.rects) {
            let r = svg_json.rects[rect];
            svg += `<rect x="${r.x1}" y="${r.y1}" width="${r.width}" height="${r.height}" fill="${r.fill}" stroke="${r.stroke}" stroke-width="${r.strokeWidth}"/>\n`;
        }
        console.log(svg);
        return svg + "</svg>";
    }
    downloadImage(i_1) {
        return __awaiter(this, arguments, void 0, function* (i, isRetry = false) {
            var _a, _b;
            if (isRetry) {
                let my_div = (_a = this.container) === null || _a === void 0 ? void 0 : _a.getElementsByClassName("svg" + i);
                my_div[0].removeChild(my_div[0].getElementsByClassName("retry" + i)[0]);
                my_div[0].appendChild(this._createOneSpinner(i));
            }
            let url = ImageLoader.serverUrl + "/randomImg";
            let response = yield fetch(url);
            let my_div = (_b = this.container) === null || _b === void 0 ? void 0 : _b.getElementsByClassName("svg" + i);
            my_div[0].removeChild(my_div[0].getElementsByClassName("spinner" + i)[0]);
            if (response.ok) {
                let svg_json_str = yield response.json();
                let svg_json = JSON.parse(svg_json_str);
                // console.log(svg_json);
                my_div[0].innerHTML += this._make_svg_str_from_json(svg_json);
            }
            else {
                let button = document.createElement("button");
                button.innerText = "Retry";
                button.onclick = () => this.downloadImage(i, true);
                button.className = "retry" + i;
                my_div[0].appendChild(button);
            }
        });
    }
    loadImages() {
        return __awaiter(this, void 0, void 0, function* () {
            // najpierw tworzymy wszystkie divy, dajemy do nich spinnery a
            // dopiero potem ściaągamy obrazki z servera
            this.createSpinners();
            for (let i = 0; i < ImageLoader.nbr_of_imgs; i++) {
                this.downloadImage(i);
            }
        });
    }
}
ImageLoader.nbr_of_imgs = 10;
ImageLoader.serverUrl = serverUrl;
function main() {
    let imgLoader = new ImageLoader();
    imgLoader.loadImages();
}
main();
