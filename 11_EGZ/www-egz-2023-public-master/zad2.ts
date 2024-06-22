let fastApi_url = "http://127.0.0.1:8000"

// Klasa price która będzie nam aktualizaować cenę i pamiętać ją
class Prices
{
    private _price: number;

    constructor()
    {
        this._price = -1;
    }

    get price()
    {
        return this._price;
    }

    set price(value: number)
    {
        this._price = value;
    }

    change_price(value: number, is_multiplying: boolean)
    {
        if(is_multiplying)
        {
            this._price = this._price * value;
        }
        else
        {
            this._price = this.price / value;
        }
    }
}

// Funkcja tworzy diva z ceną i dodaje go do body i jeśli div istnieje to tylko
// podmienia jego wartość
function display_price_in_html_file(price: number)
{
    let price_div = document.getElementById("price_div");
    if (price_div)
    {
        price_div.innerText = price.toString();
    }
    else 
    {
        let new_div = document.createElement("div");
        new_div.innerText = price.toString();
        new_div.setAttribute("id", "price_div");
        document.body.appendChild(new_div);
    }
}

let curr_price_obj = new Prices();

async function fetch_price_from_fastApi()
{
    let url = fastApi_url + "/current";
    let response = await fetch(url);
    
    // Sprawdzamy czy serwer nie zwrocil bledu, jesli nie zwrocil to 
    if (response.ok)
    {
        let price_json = await response.json();
        let curr_price = parseFloat(price_json["current"]);

        if (isNaN(curr_price))
        {
            console.log("Error: price is not a number");
        }
        else 
        {
            curr_price_obj.price = curr_price;
            display_price_in_html_file(curr_price_obj.price);
        }
    }
    else 
    {
        console.log("Error: " + response.status);
    }
}

fetch_price_from_fastApi();


let ws = new WebSocket(`ws://127.0.0.1:8000/ws`);

interface ExpectedDataFormat
{
    value: number;
    method: string;
}


ws.onmessage = function(event) 
{
    event.preventDefault();
    let data = JSON.parse(event.data);

    if ("value" in data && "method" in data)
    {
        let value = parseFloat(data["value"]);
        let method = data["method"];

        if (method === "multiply")
        {
            curr_price_obj.change_price(value, true);
            display_price_in_html_file(curr_price_obj.price);
        }
        else if (method === "divide")
        {
            curr_price_obj.change_price(value, false);
            display_price_in_html_file(curr_price_obj.price);
        }
        else 
        {
            console.log("Error: unknown method");
        }
    }
    else 
    {
        console.log("Error: wrong data format");
    }
};

ws.onclose = function(event)
{
    console.log("Connection closed");
    console.log("event code, reason: ", event.code, event.reason);
};