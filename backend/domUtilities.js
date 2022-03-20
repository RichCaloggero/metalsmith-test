let statusArea = null;
const delay = 300;

export function createStatusArea (element = document.body, where = "afterBegin") {
const div = document.createElement("div");
div.setAttribute("role", "status");
statusArea = element.insertAdjacentElement(where, div);
} // createStatusArea

export function statusMessage (text) {
//setTimeout(() => {
statusArea.textContent = ""; statusArea.textContent = text;
//}, delay);
} // statusMessage

export function $ (s, c = document) {return c.querySelector(s);}
export function $$ (s, c = document) {return [...c.querySelectorAll(s)];}
export function not (x) {return !Boolean(x);}
