let serverUrl = "http://127.0.0.1:8000"

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

class ImageLoader{
    private static nbr_of_imgs = 10;
    private static serverUrl = serverUrl;
    container: HTMLElement | null; 

    constructor(){
        this.container = document.getElementById("svgList");
    }

    private _createOneSpinner(i: number)
    {
        let spinner = document.createElement("img");
        spinner.className = "spinner" + i;
        spinner.src = "spinner.gif";
        spinner.width = 150;
        spinner.height = 150;
        return spinner;
    }

    private createSpinners()
    {
        for (let i = 0; i < ImageLoader.nbr_of_imgs; i++){
            let svg_div = document.createElement("div");
            svg_div.className = "svg" + i;
            // svg_div.style.border = "1px solid black";
            // svg_div.style.width = "300px";
            let spinner = this._createOneSpinner(i)
            let p = document.createElement("p");
            p.innerText = "image " + i + ":";

            svg_div.appendChild(p);
            svg_div.appendChild(spinner);
                
            this.container?.appendChild(svg_div);
            // this.container?.appendChild(document.createElement("br"));
        }
    }

    private _make_svg_str_from_json(svg_json: InnerDict): string{

        let svg = `<svg width="${svg_json.width}" height="${svg_json.height}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid black">\n`;

        for (let rect in svg_json.rects)
        {
            let r = svg_json.rects[rect];
            svg += `<rect x="${r.x1}" y="${r.y1}" width="${r.width}" height="${r.height}" fill="${r.fill}" stroke="${r.stroke}" stroke-width="${r.strokeWidth}"/>\n`;
        }
        // console.log(svg);
        return svg + "</svg>";
    }

    private async downloadImage(i: number, isRetry: boolean = false)
    {
        console.log("downloading image " + i);
        // Sprawdzamy czy ustawiona jest atrybut retry, jesli tak to znaczy ze
        // za pierwszym razem w glownej petli nie udalo sie pobrac obrazka,
        // wiec usuwamy przycisk retry i dodajemy spinner
        if (isRetry)
        {
            let my_div = this.container?.getElementsByClassName("svg" + i);
            my_div![0].removeChild(my_div![0].getElementsByClassName("retry" + i)[0]);
            my_div![0].appendChild(this._createOneSpinner(i));
        }

        let url = ImageLoader.serverUrl + "/randomImg";
        let response = await fetch(url);
        let my_div = this.container?.getElementsByClassName("svg" + i);
        
        my_div![0].removeChild(my_div![0].getElementsByClassName("spinner" + i)[0]);

        // Sprawdzamy czy serwer nie zwrocil bledu, jesli nie zwrocil to 
        // pobieramy obrazek i dodajemy go do diva
        // jesli zwrocil blad to dodajemy przycisk retry
        if (response.ok)
        {
            let svg_json_str = await response.json();
            if (svg_json_str.length >= 25500)
            {
                let button = document.createElement("button");
                button.innerText = "Retry - too big img";
                button.onclick = () => this.downloadImage(i, true);
                button.className = "retry" + i;
                my_div![0].appendChild(button);
            }
            else
            {
                let svg_json: InnerDict = JSON.parse(svg_json_str);
                my_div![0].innerHTML += this._make_svg_str_from_json(svg_json);
            }
        }
        else 
        {
            let button = document.createElement("button");
            button.innerText = "Retry";
            button.onclick = () => this.downloadImage(i, true);
            button.className = "retry" + i;
            my_div![0].appendChild(button);
        }

    }

    async loadImages(){
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
}
main();