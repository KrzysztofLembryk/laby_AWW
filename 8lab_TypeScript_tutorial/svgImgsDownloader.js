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
    createSpinners() {
        var _a, _b;
        for (let i = 0; i < ImageLoader.nbr_of_imgs; i++) {
            let svg_div = document.createElement("div");
            svg_div.className = "svg" + i;
            let spinner = document.createElement("img");
            spinner.className = "spinner" + i;
            spinner.src = "spinner.gif";
            spinner.width = 150;
            spinner.height = 150;
            svg_div.appendChild(spinner);
            spinner.onerror = () => {
            };
            (_a = this.container) === null || _a === void 0 ? void 0 : _a.appendChild(svg_div);
            (_b = this.container) === null || _b === void 0 ? void 0 : _b.appendChild(document.createElement("br"));
        }
    }
    // private convertToSvg(svg: string): string{
    // }
    downloadImage(i) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let url = ImageLoader.serverUrl + "/randomImg";
            let response = yield fetch(url);
            let svg = yield response.json();
            let my_div = (_a = this.container) === null || _a === void 0 ? void 0 : _a.getElementsByClassName("svg" + i);
            my_div[0].removeChild(my_div[0].getElementsByClassName("spinner" + i)[0]);
            // let svg_div = document.getElementById("svg" + i);
            // svg_div.innerHTML = svg;
        });
    }
    loadImages() {
        // najpierw tworzymy wszystkie divy, dajemy do nich spinnery a
        // dopiero potem ściaągamy obrazki z servera
        this.createSpinners();
        for (let i = 0; i < ImageLoader.nbr_of_imgs; i++) {
            this.downloadImage(i);
        }
    }
}
ImageLoader.nbr_of_imgs = 10;
ImageLoader.serverUrl = serverUrl;
function main() {
    let imgLoader = new ImageLoader();
    imgLoader.loadImages();
    // document.body.appendChild(imgLoader.container);
}
main();
