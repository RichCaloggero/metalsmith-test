import * as fs from "fs";
import * as path from "path";
import express from "express";
const app = express();

import * as https from "https";
const server = https.createServer({
key: fs.readFileSync("RootCA.key"),
cert: fs.readFileSync("RootCA.crt"),
requestCert: false,
rejectUnauthorized: false
}, app);

import * as socketIO from "socket.io";
const io = new socketIO.Server(server, {
cors: {origin: "http://localhost:8000"}
});

import * as auth from "./auth.js";
import build from "../build.js";
import registerSocketEvents from "./socketEvents.js";

const activeSockets = new Map();

express.static.mime.define({"text/javascript": "js"});

app.use(express.static("site"));
app.get("/admin/*", sendClient);

io.on("connection", socket => {
console.log(`Connection established via ${socket.conn.transport.name}: ${socket.id}`);
socket.conn.once("upgrade", () => {
console.log(`${socket.id} upgraded transport to ${socket.conn.transport.name}`);
}); // log connection

activeSockets.set(socket, {}); // maintain state
requestLogin(socket);

registerSocketEvents(socket, {
requestLogin: {handler: login, response: ["loginComplete", "loginFailed"]},
requestFileList: {handler: fileList, response: "fileList"},
requestFile: {handler: fileContents, response: "fileContents"},
requestFileUpdate: {handler: updateFile, response: "fileUpdateComplete"},
requestUpdateUserInfo: {handler: updateUserInfo, response: ["updateUserInfoComplete", "updateUserInfoFailed"]},
requestAddUser: {handler: addUser, response: ["addUserComplete", "addUserFailed"]},
error: handleSocketError,
disconnect: handleSocketDisconnect
}); // registerEvents
}); // socket

server.listen(3000, () => {
console.log("Listening on port 3000");
}); // listen



/// event handlers

function login (socket, data) {
console.log("login: ", data);
const userInfo = auth.login(data.eMail, data.password);
return userInfo? activeSockets.get(socket).userInfo = Object.assign({}, userInfo, {password: ""})
: null;
} // login

function requestLogin (socket, data) {
socket.emit("requestLogin");
} // forceLogout

function fileList (socket, data) {
if (validLogin(socket)) {
console.log("sending fileList");
return (activeSockets.get(socket).fileList = getFileList(socket));
} // if
} // fileList

function getFileList () {
return getAllFiles("source");
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

function updateUserInfo (socket, data) {
if (validLogin(socket)) return auth.updateUserInfo(data);
} // updateUserInfo

function addUser (socket, data) {
return auth.addUser(data);
} // addUser

function handleSocketError (socket, data) {
console.log("error: ", data);
} // handleError

function handleSocketDisconnect (socket, data) {
activeSockets.delete(socket);
console.log(`socket ${socket.id} disconnected;  ${data}`);
console.log(`${activeSockets.size} active sockets found.`);
} // handleSocketDisconnect

function validLogin (socket) {
return activeSockets.get(socket).userInfo;
} // validLogin


function sendClient (req, res, next) {
const url = path.parse(req.url);
const name = url.ext.toLowerCase() === ".js"? url.base
: "client.html";
console.log("sendFile: ", req.url, url.ext, name);

res.sendFile(name, {root: "./backend"});
} // sendClient


function getAllFiles  (dirPath, list = []) {
const files = fs.readdirSync(dirPath);

files.forEach(file => {
const _file = dirPath + "/" + file;
if (fs.statSync(_file).isDirectory()) {
list = getAllFiles(_file, list);
} else {
list.push(
path.join(dirPath, "/", file));
} // if
}); // forEach

return list;
} // getAllFiles
