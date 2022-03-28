import fs from "fs";
import crypto from "crypto";

const db = readDatabase();


export function deleteAllUsers () {
db.users = {};
writeDatabase(db);
} // deleteAllUsers

export function countUsers () {
return Object.keys(db.users);
} // countUsers

export function updateUserInfo (info) {
const oldInfo = getUser(info.eMail);
const newInfo = oldInfo?
Object.assign({}, oldInfo, info)
: info;
newInfo.password = hash(info.password);
db.users[newInfo.eMail] = newInfo;
writeDatabase(db);
console.log("updateUserInfo: ", oldInfo, ", ", newInfo);

return true;
} // updateUserInfo

export function deleteUserInfo (eMail) {
return (eMail && userExists(eMail))? delete db.users[eMail]
: false;
} // deleteUserInfo

export function validateInfo (info) {
return Object.keys(db.template).every(key =>
info.hasOwnProperty(key) && typeof(info[key]) === typeof(db.template[key]));
} // validateInfo

export function login (eMail, password) {
password = hash(password);
const user = getUser(eMail);

return (user && hashMatch(password, user.password))? user : null;
} // login

export function getUser (key = "") {
return db.users[key] || null;
} // getUser

function find (key, value) {
return db.users.filter(user => user[key] === value);
} // find

function identical (a) {
return (a && Array.isArray(a) && a.length > 0)?
a.every((x, i, a) => x === a[0])
: false;
} // identical

function readDatabase () {
return JSON.parse(fs.readFileSync("./backend/users.json").toString());
} // readDatabase

function writeDatabase (db) {
fs.writeFileSync("./backend/users.json", JSON.stringify(db, null, 2));
} // writeDatabase

export function flushDatabase () {writeDatabase(db);}


export function hash (message) {
const _hash = crypto.createHash("sha256");
_hash.update(message);
return [..._hash.digest().values()];
} // hash

export function hashMatch (h1, h2) {
if (not(h1) || not(h2) || h1.length !== h2.length) return false;

return h1.every((x, i) => x === h2[i]);
} // hashMatch 

export function userExists (eMail) {
return eMail && getUser(eMail);
} // userExists

export function isAdmin (eMail) {
console.log("isAdmin: ", eMail);
return db.roles[eMail] === "admin";
} // isAdmin

export function getUserList () {
return Object.keys(db.users).map(eMail => Object.assign({}, db.users[eMail], {password: ""}));
} // getUserList

function not (x) {return !Boolean(x);}

