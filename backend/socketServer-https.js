const fs = require("fs");
const express = require("express");
const app = express();

const httpServer = require("https").createServer({
key: fs.readFileSync("RootCA.key"),
cert: fs.readFileSync("RootCA.crt"),
requestCert: false,
rejectUnauthorized: false
}, app);
const io = require('socket.io')(httpServer, {
cors: {origin: "http://localhost:8000"}
});

const auth = require("./auth.js");

app.use(express.static("site"));
app.get("/admin/*", sendLoginPage);

io.on("connection", socket => {
console.log(`Connection established via ${socket.conn.transport.name}: ${socket.id}`);
socket.conn.once("upgrade", () => {
console.log(`${socket.id} upgraded transport to ${socket.conn.transport.name}`);
});

socket.on("login", login);
socket.on("getFile", getFile);
socket.on("updateFile", updateFile);
socket.on("error", handleError);

socket.on("disconnect", async (reason) => {
console.log(`Socket ${socket.id} disconnected -  ${reason}`);
});


/// event handlers

function login (data) {
console.log("login: ", data);
const user = auth.login(data.eMail, data.password);
if (user) establishSession(socket);
else socket.emit("login:failed");
} // login

function getFile (data) {
console.log("getFile: ", data);
} // getFile


function updateFile (data) {
console.log("updateFile: ", data);
} // updateFile

function handleError (data) {
console.log("error: ", data);
} // handleError

}); // listen for events

httpServer.listen(3000, () => {
console.log("Listening on port 3000");
});


function sendLoginPage(req, res, next) {
res.sendFile("html/login.html", {root: "./backend"});
} // sendLoginPage

function establishSession (socket) {
socket.emit("login:success");
} // establishSession
