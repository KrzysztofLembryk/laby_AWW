import * as utils from "./utils"

function addd(a: number, b: number): number 
{
    return a + b;
}

let exmpl_obj: {name: string, x: number, y: number};
exmpl_obj = {name: "example", x: 69, y: 420};

console.log(exmpl_obj.name, exmpl_obj.x, exmpl_obj.y);

// Mozna do zmiennej przypisac funkcje, ktora przyjmuje dwa number i zwraca 
// number.
let func_var: (a: number, b: number) => number;
func_var = addd;
console.log(func_var(45, 24));

let lst_of_imgs: utils.SVG_Image[] = [];