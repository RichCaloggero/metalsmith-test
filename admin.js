const marked = require ("marked");
const fs = require("fs");
const express = require("express");
let error = "";

module.exports = function (req, res) {
let content = "";

try {
content = fs.readFileSync("source/" + path(req.path)).toString();
console.log("read file...");

} catch (e) {
error = e;
res.send(errorResponse(e));
res.end();
return;
} // try

res.send(contentForm(content));
req.app.use(express.urlencoded());
req.app.post("/admin/" + path(req.path), receiveContent);
} // admin

/// receiver

function receiveContent (req, res) {
const content = req.body.content;
//console.log("got body: ", content);

try {
fs.writeFileSync("source/" + path(req.path), content);

} catch (e) {
res.send(errorResponse(e));
res.end();
} // try

res.send(`
${head("saved")}
${body(`
<p role="alert">Save Complete</p>
${contentForm(content)}
`)}
`); // send
res.end();
} // receiveContent

function invalidResponse (req, res) {
res.send(errorResponse(error));
} // invalidResponse


/// simple html generator

function errorResponse (error) {
return `${head("error")}
${body(error)}
`;
} // errorResponse

function contentForm (content) {
return `${head("edit...")}
${body(editContent(content))}
`;
} // content

function editContent(content) {
return `<form method="post" action="#">
<textarea  name="content" rows=30 cols="80">
${content}
</textarea>
<hr>
<input type="submit" name="submit">
</form>
`;
} // editContent

function head (title) {
return `<head>
<meta utf-8>
<title>${title}</title>
</head>
`;
} // head

function body (content) {
return `<body>
${content}
</body>
</html>
`;
} // body

function path (path) {
return path.split("/").slice(2).filter(p => p).join("/");
} // path

