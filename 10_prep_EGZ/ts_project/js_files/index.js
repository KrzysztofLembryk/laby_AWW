"use strict";
function addd(a, b) {
    return a + b;
}
let exmpl_obj;
exmpl_obj = { name: "example", x: 69, y: 420 };
console.log(exmpl_obj.name, exmpl_obj.x, exmpl_obj.y);
// Mozna do zmiennej przypisac funkcje, ktora przyjmuje dwa number i zwraca 
// number.
let func_var;
func_var = addd;
console.log(func_var(45, 24));
