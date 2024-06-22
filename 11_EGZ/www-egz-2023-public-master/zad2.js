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
let ws = new WebSocket(`ws://127.0.0.1:8000/ws`);
ws.onmessage = function (event) {
    event.preventDefault();
    let data = JSON.parse(event.data);
    if ("value" in data && "method" in data) {
        let value = parseFloat(data["value"]);
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
            console.log("Error: unknown method");
        }
    }
    else {
        console.log("Error: wrong data format");
    }
};
ws.onclose = function (event) {
    console.log("Connection closed");
    console.log("event code, reason: ", event.code, event.reason);
};
