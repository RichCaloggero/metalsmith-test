const marked = require ("marked");
const fs = require("fs");
const express = require("express");
const server = require('http').createServer(express());
const io = require('socket.io')(server);


module.exports = function (req, res) {
let content = "";

try {
content = fs.readFileSync("source/" + path(req.path)).toString();
console.log("read file...");

} catch (e) {
res.send(errorResponse(e));
res.end();
return
} // try

startSocket (content);
} // admin


function startSocket (content) {
sendEditorPage(content);
io.on('connection', handleSocket);
server.listen(3000);
} // startSocket


/// receiver

function receiveContent (req, res) {
console.log("got body: ", req.body);
try {
fs.writeFileSync("source/" + path(req.path), req.body.content);
res.send(`
${head("saved")}
${body("Save complete.")}
`);

} catch (e) {
res.send(`
${head("error")}
${body(e)}
`);
} // try
res.end();
} // receiveContent

function invalidResponse (req, res) {
res.send(errorResponse(error));
} // invalidResponse


/// simple html generator

function errorResponse (content) {
return `${head("error")}
${body(content)}
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

