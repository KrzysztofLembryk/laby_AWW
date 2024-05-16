"use strict";
// interface OuterDict {
//     name: string;
//     svg: InnerDict;
// }
// interface Dicts {
//     svgs: OuterDict[];
// }
function _make_svg_str_from_json(svg_json) {
    let svg = `<svg width="${svg_json.width}" height="${svg_json.height}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid black">\n`;
    for (let rect in svg_json.rects) {
        let r = svg_json.rects[rect];
        svg += `<rect x="${r.x1}" y="${r.y1}" width="${r.width}" height="${r.height}" fill="${r.fill}" stroke="${r.stroke}" stroke-width="${r.strokeWidth}"/>\n`;
    }
    console.log(svg);
    return svg + "</svg>";
}
let client_id = Date.now();
document.querySelector("#ws-id").textContent = "" + client_id;
let ws = new WebSocket(`ws://127.0.0.1:8000/ws/${client_id}`);
function sendMessage(event) {
    ws.send("Refresh");
    // event.preventDefault();
}
ws.onmessage = function (event) {
    console.log(event.data);
    let svgLst = document.getElementById('recentAddedLst');
    let svg_dict_lst = JSON.parse(event.data);
    // console.log(svg_lst);
    for (let svg in svg_dict_lst) {
        console.log(svg);
        console.log("xdxd");
        // let lstElem = document.createElement('li');
        let div = document.createElement('div');
        let svg_str = _make_svg_str_from_json(svg_dict_lst[svg]);
        div.innerHTML = svg_str;
        // let content = document.createTextNode(svg_str);
        // lstElem.appendChild(div);
        svgLst.appendChild(div);
    }
};
