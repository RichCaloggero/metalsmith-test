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
const registerSocketEvents = require("./socketEvents.js");

const activeSockets = new Map();

express.static.mime.define({"text/javascript": "js"});

app.use(express.static("site"));
app.get("/admin/*", sendClient);

io.on("connection", socket => {
console.log(`Connection established via ${socket.conn.transport.name}: ${socket.id}`);
socket.conn.once("upgrade", () => {
console.log(`${socket.id} upgraded transport to ${socket.conn.transport.name}`);
}); // log connection
socket.onAny((event, ...data) => {
console.log("received: ", event, data);
}); // log events

activeSockets.set(socket, {}); // maintain state

registerSocketEvents(socket, {
requestLogin: {handler: login, response: ["loginComplete", "loginFailed"]},
requestFileList: {handler: fileList, response: "fileList"},
requestFile: {handler: fileContents, response: "fileContents"},
requestFileUpdate: {handler: updateFile, response: "fileUpdateComplete"},
error: handleSocketError,
disconnect: handleSocketDisconnect
}); // registerEvents
}); // socket

server.listen(3000, () => {
console.log("Listening on port 3000");
});



/// event handlers

function login (socket, data) {
console.log("login: ", data);
return activeSockets.get(socket).userInfo = auth.login(data.eMail, data.password);
} // login

function fileList (socket, data) {
if (validLogin(socket)) {
console.log("sending fileList");
return (activeSockets.get(socket).fileList = getFileList(socket));
} // if
} // fileList

function getFileList () {
return file.getAllFiles("source");
} // getFileList

function fileContents (socket, data) {
if (validLogin(socket)) {
const fileList = activeSockets.get(socket).fileList;
console.log("sendFile: fileList.length = ", fileList?.length);
if (fileList.includes(data.name)) {
return {name: data.name, contents: fs.readFileSync(data.name).toString()};
} // if
} // if
} // fileContents

function updateFile (socket, data) {
if (validLogin(socket) && data.name) {
fs.writeFileSync(data.name, data.contents);
build();
return {name: data.name};
} // if
} // updateFile

function handleSocketError (socket, data) {
console.log("error: ", data);
} // handleError

function handleSocketDisconnect (socket, data) {
activeSockets.delete(socket);
console.log(`socket ${socket.id} disconnected;  ${data}`);
} // handleSocketDisconnect

function validLogin (socket) {
return activeSockets.get(socket).userInfo;
} // validLogin


function sendClient (req, res, next) {
const url = path.parse(req.url);
const name = url.ext.toLowerCase() === ".js"? url.base
: "client.html";
console.log("sendFile: ", req.url, url.ext, name);

res.sendFile(name, {root: "./backend/client"});
} // sendClient


