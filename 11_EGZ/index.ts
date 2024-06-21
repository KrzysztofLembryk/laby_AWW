





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