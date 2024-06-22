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
let fastApi_url = "http://127.0.0.1:8000";
let ws_fastpi_url = "ws://127.0.0.1:8000/ws";
// Klasa price która będzie nam aktualizaować cenę i pamiętać ją
class Prices {
    constructor() {
        this._price = -1;
    }
    get price() {
        return this._price;
    }
    set price(value) {
        this._price = value;
    }
    change_price(value, is_multiplying) {
        if (is_multiplying) {
            this._price = this._price * value;
        }
        else {
            this._price = this.price / value;
        }
    }
}
// Funkcja tworzy diva z ceną i dodaje go do body i jeśli div istnieje to tylko
// podmienia jego wartość
function display_price_in_html_file(price) {
    let price_div = document.getElementById("price_div");
    if (price_div) {
        price_div.innerText = price.toString();
    }
    else {
        let new_div = document.createElement("div");
        new_div.innerText = price.toString();
        new_div.setAttribute("id", "price_div");
        document.body.appendChild(new_div);
    }
}
let curr_price_obj = new Prices();
function fetch_price_from_fastApi() {
    return __awaiter(this, void 0, void 0, function* () {
        let url = fastApi_url + "/current";
        let response = yield fetch(url);
        // Sprawdzamy czy serwer nie zwrocil bledu, jesli nie zwrocil to 
        if (response.ok) {
            let price_json = yield response.json();
            let curr_price = parseFloat(price_json["current"]);
            if (isNaN(curr_price)) {
                console.log("Error: price is not a number");
            }
            else {
                curr_price_obj.price = curr_price;
                display_price_in_html_file(curr_price_obj.price);
            }
        }
        else {
            console.log("Error: " + response.status);
        }
    });
}
fetch_price_from_fastApi();
let i_closed_ws = false;
function handle_button_making(msg) {
    let refresh_btn = document.createElement("button");
    refresh_btn.innerText = msg;
    refresh_btn.setAttribute("id", "refresh_btn");
    refresh_btn.onclick = connectToSocket;
    document.body.appendChild(refresh_btn);
}
function connectToSocket() {
    let btn = document.getElementById("refresh_btn");
    if (btn) {
        btn.remove();
    }
    let ws = new WebSocket(ws_fastpi_url);
    ws.onmessage = function (event) {
        event.preventDefault();
        let data = JSON.parse(event.data);
        try {
            if ("value" in data && "method" in data) {
                let value = parseFloat(data["value"]);
                if (isNaN(value)) {
                    throw new Error("ERROR: recv val form socket is not a number");
                }
                else {
                    let method = data["method"];
                    if (method === "multiply") {
                        curr_price_obj.change_price(value, true);
                        display_price_in_html_file(curr_price_obj.price);
                    }
                    else if (method === "divide") {
                        curr_price_obj.change_price(value, false);
                        display_price_in_html_file(curr_price_obj.price);
                    }
                    else {
                        throw new Error("ERROR: wrong method name");
                    }
                }
            }
            else {
                throw new Error("Error: wrong data format");
            }
        }
        catch (error) {
            // Wyswietlamy error tam gdzie wyswietlalismy cene
            let price_div = document.getElementById("price_div");
            price_div.innerText = error.message;
            handle_button_making("Refresh button");
            i_closed_ws = true;
            ws.close();
        }
    };
    ws.onclose = function (event) {
        if (!i_closed_ws) {
            let price_div = document.getElementById("price_div");
            price_div.innerText = "Connection closed by server";
            handle_button_making("Reconnect?");
        }
        else {
            i_closed_ws = false;
        }
    };
}
connectToSocket();
