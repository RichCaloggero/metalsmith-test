const html = require("./html.js");
const marked = require ("marked");
const fs = require("fs");
const express = require("express");
const buildSite = require("../build.js");
const auth = require("./auth.js");

function editFile (req, res, next) {
let content = "";

try {
content = fs.readFileSync("source/" + path(req.path)).toString();
console.log("read file...");

} catch (e) {
res.send(html.errorResponse(e));
res.end();
return;
} // try

res.send(html.htmlResponse("edit...", editForm(content)));
req.app.post("/admin/" + path(req.path), receiveContent);
} // admin





/// receiver

function receiveContent (req, res) {
const content = req.body.content;
//console.log("got body: ", content);

try {
fs.writeFileSync("source/" + path(req.path), content);
buildSite();

} catch (e) {
res.send(html.errorResponse(e));
res.end();
} // try

res.send(html.htmlResponse("save complete",
`<p role="alert">Save Complete</p>
${editForm(content)}
`)); // send
res.end();
} // receiveContent


/// authentication

function login (req, res, next) {
console.log("login: ", req.app.get("path"), req.app.get("authenticated"));
if (not(req.app.get("authenticated"))) {
req.app.set("path", path(req.path));
res.send(html.htmlResponse("Login", loginForm()));
} else {
next();
} // if
} // login

function authenticate (req, res, next) {
const eMail = req.body.eMail;
const password = req.body.password;
console.log("authenticate: ", eMail, password, auth.login(eMail,password));

if (auth.login(eMail, password)) {
req.app.set("authenticated", true);
res.location(req.app.get("path"));
} else {
next("route");
} // if
} // authenticate

function path (path) {
return path.split("/").slice(2).filter(p => p).join("/");
} // path

function not (x) {return !Boolean(x);}

function editForm (content) {
return `<form method="post" action="#">
<textarea  autofocus name="content" rows=30 cols="80">
${content}
</textarea>
<hr>
<input type="submit" name="submit">
</form>
`;
} // editForm

function loginForm (tryAgain) {
return `
${tryAgain? '<p role="alert">Invalid credentials; try again.</p>' : ''}
<form method="post" action="/login">
<label>eMail: <input type="text" name="eMail"></label>
<label>Password: <input type="password" name="password"></label>
<input type="submit" name="submit">
</form>
`;
} // loginForm

/// exports

module.exports = {
editFile, login, authenticate
};
