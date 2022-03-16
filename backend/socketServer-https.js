const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();

const server = require("https").createServer({
key: fs.readFileSync("RootCA.key"),
cert: fs.readFileSync("RootCA.crt"),
requestCert: false,
rejectUnauthorized: false
}, app);
const io = require('socket.io')(server, {
cors: {origin: "http://localhost:8000"}
});

const auth = require("./auth.js");
const file = require("./file.js");
const build = require("../build.js");
const activeSockets = new Map();

express.static.mime.define({"text/javascript": "js"});

app.use(express.static("site"));
app.get("/admin/*", sendClient);

io.on("connection", socket => {
console.log(`Connection established via ${socket.conn.transport.name}: ${socket.id}`);
socket.conn.once("upgrade", () => {
console.log(`${socket.id} upgraded transport to ${socket.conn.transport.name}`);
});
activeSockets.set(socket, {});

socket.onAny((event, ...data) => {
console.log("received: ", event, data);
}); // onAny


socket.on("requestLogin", login);
socket.on("requestFile", sendFile);
socket.on("requestFileUpdate", updateFile);
socket.on("error", handleError);

socket.on("disconnect", async (reason) => {
console.log(`Socket ${socket.id} disconnected -  ${reason}`);
activeSockets.delete(socket);
});


/// event handlers

function login (data) {
console.log("login: ", data);
const user = auth.login(data.eMail, data.password);
if (user) {
activeSockets.get(socket).userInfo = user;
activeSockets.get(socket).fileList = sendFileList(socket);

} else {
socket.emit("loginFailed");
} // if
} // login

function sendFileList (socket) {
if (validLogin()) {
const fileList = file.getAllFiles("source");
console.log("sendFileList: ", fileList.length, " files to send...");
socket.emit("fileList", {fileList});
return fileList;
} else {
return [];
} // if
} // sendFileList

function sendFile (data) {
if (validLogin()) {
const fileList = activeSockets.get(socket).fileList;
console.log("sendFile: fileList.length = ", fileList?.length);
if (fileList.includes(data.name)) {
socket.emit("fileContents", {name: data.name, contents: fs.readFileSync(data.name).toString()});
console.log("sendFile: ", data);
} // if
} // if
} // sendFile

function updateFile (data) {
if (validLogin()) {
fs.writeFileSync(data.name, data.contents);
build();
socket.emit("updateSuccessful", {name: data.name});
console.log("updateFile: ", data);
} // if
} // updateFile

function handleError (data) {
console.log("error: ", data);
} // handleError

function validLogin () {
return activeSockets.get(socket).userInfo;
} // validLogin

}); // listen for events

server.listen(3000, () => {
console.log("Listening on port 3000");
});

function sendClient (req, res, next) {
const url = path.parse(req.url);
const name = url.ext.toLowerCase() === ".js"? url.base
: "client.html";
console.log("sendFile: ", req.url, url.ext, name);

res.sendFile(name, {root: "./backend/client"});
} // sendClient


