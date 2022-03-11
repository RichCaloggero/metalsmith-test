const html = require("./html.js");
const marked = require ("marked");
const fs = require("fs");
const express = require("express");

module.exports = function admin (req, res) {


let content = "";

try {
content = fs.readFileSync("source/" + path(req.path)).toString();
console.log("read file...");

} catch (e) {
res.send(html.errorResponse(e));
res.end();
return;
} // try

res.send(html.htmlResponse("edit...", html.editForm(content)));
req.app.use(express.urlencoded());
req.app.post("/admin/" + path(req.path), receiveContent);
} // admin

/// login




/// receiver

function receiveContent (req, res) {
const content = req.body.content;
//console.log("got body: ", content);

try {
fs.writeFileSync("source/" + path(req.path), content);

} catch (e) {
res.send(html.errorResponse(e));
res.end();
} // try

res.send(html.htmlResponse("save complete",
`<p role="alert">Save Complete</p>
${content}
`)); // send
res.end();
} // receiveContent



function path (path) {
return path.split("/").slice(2).filter(p => p).join("/");
} // path

function not (x) {return !Boolean(x);}

