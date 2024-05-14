let serverUrl = "http://127.0.0.1:8000"

interface Rect {
    x1: number;
    y1: number;
    width: number;
    height: number;
    fill: string;
    stroke: string;
    strokeWidth: number;
    // constructor(x1: number, y1: number, width: number, height: number, fill: string, stroke: string, strokeWidth: number){
    //     this.x1 = x1;
    //     this.y1 = y1;
    //     this.width = width;
    //     this.height = height;
    //     this.fill = fill;
    //     this.stroke = stroke;
    //     this.strokeWidth = strokeWidth;
    // }
}

interface Dict  {
    width: number;
    height: number;
    rects: Rect[];

    // constructor(width: number, height: number, rects: Rect[]){
    //     this.width = width;
    //     this.height = height;
    //     this.rects = rects;
    // }
}

class ImageLoader{
    private static nbr_of_imgs = 10;
    private static serverUrl = serverUrl;
    container: HTMLElement | null; 

    constructor(){
        this.container = document.getElementById("svgList");
    }


    private createSpinners()
    {
        for (let i = 0; i < ImageLoader.nbr_of_imgs; i++){
            let svg_div = document.createElement("div");
            svg_div.className = "svg" + i;
            // svg_div.style.border = "1px solid black";
            // svg_div.style.width = "300px";
            let spinner = document.createElement("img");
            spinner.className = "spinner" + i;
            spinner.src = "spinner.gif";
            spinner.width = 150;
            spinner.height = 150;

            let p = document.createElement("p");
            p.innerText = "image " + i + ":";

            svg_div.appendChild(p);
            svg_div.appendChild(spinner);
            spinner.onerror = () => {
                
            }
            this.container?.appendChild(svg_div);
            // this.container?.appendChild(document.createElement("br"));
        }
    }


    private make_svg_from_json(svg_json: Dict): string{

        let svg = `<svg width="${svg_json.width}" height="${svg_json.height}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid black">\n`;

        for (let rect in svg_json.rects)
        {
            let r = svg_json.rects[rect];
            svg += `<rect x="${r.x1}" y="${r.y1}" width="${r.width}" height="${r.height}" fill="${r.fill}" stroke="${r.stroke}" stroke-width="${r.strokeWidth}"/>\n`;
        }
        console.log(svg);
        return svg + "</svg>";
    }

    private async downloadImage(i: number)
    {
        let url = ImageLoader.serverUrl + "/randomImg";
        let response = await fetch(url);
        let svg_json_str = await response.json();
        let svg_json: Dict = JSON.parse(svg_json_str);

        let my_div = this.container?.getElementsByClassName("svg" + i);
        
        my_div![0].removeChild(my_div![0].getElementsByClassName("spinner" + i)[0]);

        my_div![0].innerHTML += this.make_svg_from_json(svg_json);
    }

    loadImages(){
        // najpierw tworzymy wszystkie divy, dajemy do nich spinnery a
        // dopiero potem ściaągamy obrazki z servera
        this.createSpinners();
        for (let i = 0; i < ImageLoader.nbr_of_imgs; i++){
            this.downloadImage(i);
        }
        
    }
}

function main(){
    let imgLoader = new ImageLoader();
    imgLoader.loadImages();
    // document.body.appendChild(imgLoader.container);
}
main();