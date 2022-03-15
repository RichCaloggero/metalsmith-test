const fs = require("fs");
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
const activeSockets = new Map();

app.use(express.static("site"));
app.get("/admin/*", sendClient);

io.on("connection", socket => {
console.log(`Connection established via ${socket.conn.transport.name}: ${socket.id}`);
socket.conn.once("upgrade", () => {
console.log(`${socket.id} upgraded transport to ${socket.conn.transport.name}`);
});
activeSockets.set(socket, {});

socket.on("login", login);
socket.on("requestFile", sendFile);
socket.on("updateFile", updateFile);
socket.on("error", handleError);

socket.on("disconnect", async (reason) => {
console.log(`Socket ${socket.id} disconnected -  ${reason}`);
});


/// event handlers

function login (data) {
console.log("login: ", data);
const user = auth.login(data.eMail, data.password);
if (user) {
Object.assign(
activeSockets.get(socket),
{user, fileList:  sendFileList(socket)}
); // assign
} else {
socket.emit("loginFailed");
} // if
} // login

function getFile (data) {
if (validLogin()) {
console.log("getFile: ", data);
} // if
} // getFile

function sendFile (data) {
console.log("sendFile: ", data);
if (validLogin()) {
const fileList = activeSockets.get(socket).fileList;
if (fileList.includes(data.name)) socket.emit("fileContents", {name: data.name, contents: fs.readFileSync(data.name).toString()});
} // if
} // sendFile

function updateFile (data) {
console.log("updateFile: ", data);
fs.writeFileSync(data.name, data);
} // updateFile

function handleError (data) {
console.log("error: ", data);
} // handleError

function validLogin () {
return activeSockets.get(socket).user;
} // validLogin

}); // listen for events

server.listen(3000, () => {
console.log("Listening on port 3000");
});


function sendClient (req, res, next) {
res.sendFile("html/client.html", {root: "./backend"});
} // sendLoginPage

function sendFileList (socket) {
const fileList = file.getAllFiles("source");
console.log("sendFileList: ", fileList.length, " files to send...");
socket.emit("fileList", {fileList});
return fileList;
} // sendFileList

