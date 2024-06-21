let serverUrl = "http://127.0.0.1:8000"



async function fetching_from_fastapi()
{

    let url = serverUrl + "/imgLst";
    let response = await fetch(url);
    
    // Sprawdzamy czy serwer nie zwrocil bledu, jesli nie zwrocil to 
    // pobieramy obrazek i dodajemy go do diva
    // jesli zwrocil blad to dodajemy przycisk retry
    if (response.ok)
    {
        let img_lst = await response.json();
        let imgs_div = document.getElementById("imgs")!;
        imgs_div.innerHTML = "";

        for (let id_svg of img_lst)
        {
            let div = document.createElement("div");
            div.innerHTML = id_svg["svg"];            
            imgs_div.appendChild(div);
        }
    }
    else 
    {
        console.log("Error: " + response.status);
    }
}

let btn = document.getElementById("fetch_btn")!;
btn.addEventListener("click", fetching_from_fastapi);


let ws = new WebSocket(`ws://127.0.0.1:8000/ws`);

function sendMessage(event: Event) {
    ws.send("Refresh");
    event.preventDefault();
}

ws.onmessage = function(event) 
{
    let svgLst = document.getElementById('recentAddedLst');

    event.preventDefault();
};