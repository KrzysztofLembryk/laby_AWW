interface Rect {
    x1: number;
    y1: number;
    width: number;
    height: number;
    fill: string;
    stroke: string;
    strokeWidth: number;
}

interface InnerDict  {
    width: number;
    height: number;
    rects: Rect[];
}

// interface OuterDict {
//     name: string;
//     svg: InnerDict;
// }

// interface Dicts {
//     svgs: OuterDict[];
// }


function _make_svg_str_from_json(svg_json: InnerDict): string{

        let svg = `<svg width="${svg_json.width}" height="${svg_json.height}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid black">\n`;

        for (let rect in svg_json.rects)
        {
            let r = svg_json.rects[rect];
            svg += `<rect x="${r.x1}" y="${r.y1}" width="${r.width}" height="${r.height}" fill="${r.fill}" stroke="${r.stroke}" stroke-width="${r.strokeWidth}"/>\n`;
        }
        console.log(svg + "</svg>");
        return svg + "</svg>";
    }

let client_id = Date.now()
document.querySelector("#ws-id")!.textContent = "" + client_id;
let ws = new WebSocket(`ws://127.0.0.1:8000/ws/${client_id}`);

function sendMessage(event: Event) {
    ws.send("Refresh");
    event.preventDefault();
}

ws.onmessage = function(event) 
{
    let svgLst = document.getElementById('recentAddedLst');
    svgLst!.innerHTML = "";
    let svg_dict_lst: InnerDict[] = JSON.parse(event.data);
    for (let svg in svg_dict_lst)
    {
        let div = document.createElement('div');
        let svg_str = _make_svg_str_from_json(svg_dict_lst[svg]);
        div.innerHTML = svg_str;
        svgLst!.appendChild(div);
    }
    event.preventDefault();
};