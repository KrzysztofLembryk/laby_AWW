"use strict";
function _make_svg_str_from_json(svg_json) {
    let svg = `<svg width="${svg_json.width}" height="${svg_json.height}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid black">\n`;
    for (let rect in svg_json.rects) {
        let r = svg_json.rects[rect];
        svg += `<rect x="${r.x1}" y="${r.y1}" width="${r.width}" height="${r.height}" fill="${r.fill}" stroke="${r.stroke}" stroke-width="${r.strokeWidth}"/>\n`;
    }
    console.log(svg);
    return svg + "</svg>";
}
let ws = new WebSocket("http://127.0.0.1:8000/ws");
function sendMessage(event) {
    ws.send("Refresh");
    event.preventDefault();
}
ws.onmessage = function (event) {
    let svgLst = document.getElementById('recentAddedLst');
    let svg_lst = JSON.parse(event.data);
    for (let outer in svg_lst.svgs) {
        let lstElem = document.createElement('li');
        let svg_str = _make_svg_str_from_json(svg_lst.svgs[outer].svg);
        let content = document.createTextNode(svg_str);
        lstElem.appendChild(content);
        svgLst.appendChild(lstElem);
    }
};
