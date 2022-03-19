
export function statusMessage (text) {$("#status").textContent = text; setTimeout(() => $("#status").textContent = "", 10000);}
export function $ (s, c = document) {return c.querySelector(s);}
export function $$ (s, c = document) {return [...c.querySelectorAll(s)];}
export function not (x) {return !Boolean(x);}
