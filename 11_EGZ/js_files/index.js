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
function fetching_from_fastapi() {
    return __awaiter(this, void 0, void 0, function* () {
        let url = serverUrl + "/imgLst";
        let response = yield fetch(url);
        // Sprawdzamy czy serwer nie zwrocil bledu, jesli nie zwrocil to 
        // pobieramy obrazek i dodajemy go do diva
        // jesli zwrocil blad to dodajemy przycisk retry
        if (response.ok) {
            let img_lst = yield response.json();
            let imgs_div = document.getElementById("imgs");
            imgs_div.innerHTML = "";
            for (let id_svg of img_lst) {
                let div = document.createElement("div");
                div.innerHTML = id_svg["svg"];
                imgs_div.appendChild(div);
            }
        }
        else {
            console.log("Error: " + response.status);
        }
    });
}
let btn = document.getElementById("fetch_btn");
btn.addEventListener("click", fetching_from_fastapi);
let ws = new WebSocket(`ws://127.0.0.1:8000/ws`);
function sendMessage(event) {
    ws.send("Refresh");
    event.preventDefault();
}
ws.onmessage = function (event) {
    let svgLst = document.getElementById('recentAddedLst');
    event.preventDefault();
};
