let serverUrl = "http://127.0.0.1:8000"

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

            let spinner = document.createElement("img");
            spinner.className = "spinner" + i;
            spinner.src = "spinner.gif";
            spinner.width = 150;
            spinner.height = 150;

            svg_div.appendChild(spinner);
            spinner.onerror = () => {
                
            }
            this.container?.appendChild(svg_div);
            this.container?.appendChild(document.createElement("br"));
        }
    }

    // private convertToSvg(svg: string): string{

    // }
    private async downloadImage(i: number)
    {

        let url = ImageLoader.serverUrl + "/randomImg";
        let response = await fetch(url);
        let svg = await response.json();
        let my_div = this.container?.getElementsByClassName("svg" + i);
        
        my_div![0].removeChild(my_div![0].getElementsByClassName("spinner" + i)[0]);
        // let svg_div = document.getElementById("svg" + i);
        // svg_div.innerHTML = svg;
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