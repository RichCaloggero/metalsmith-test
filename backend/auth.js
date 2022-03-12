const fs = require("fs");
const db = readDatabase();
const template = db.template;
const crypto = require("crypto");


function deleteAllUsers () {
db.users = [];
writeDatabase(db);
} // deleteAllUsers

function countUsers () {
return a.db.users.length;
} // countUsers

function add (info) {
if (validateInfo(info) && not(getUser(info))) {
const _info = Object.assign({}, info);
_info.password = hash(_info.password);
db.users.push(_info);
console.log("add: ", db.users.length, _info);
writeDatabase(db);
return true;
} // if

return false;
} // add

function validateInfo (info) {
return Object.keys(template).every(key =>
info.hasOwnProperty(key) && typeof(info[key]) === typeof(template[key]));
} // validateInfo

function login (eMail, password) {
password = hash(password);
const user = find("name", eMail);

if (user.length === 0) {
console.error(`login:  ${eMail} not found`);
return false;
} else if (user.length > 1) {
console.error("login: too many users with same eMail", user.length, eMail);
return false;
} // if

return hashMatch(password, user[0].password);
} // login

function getUser (info = {}) {
const matches = Object.entries(info).map(entry => find(...entry)).flat(9);
return identical(matches);
} // getUser

function find (key, value) {
return db.users.filter(user => user[key] === value);
} // find

function identical (a) {
return a && a.length > 0? a.every((x, i, a) => x === a[0])
: false;
} // identical

function readDatabase () {
return JSON.parse(fs.readFileSync("./backend/users.json").toString());
} // readDatabase

function writeDatabase (db) {
fs.writeFileSync("./backend/users.json", JSON.stringify(db, null, 2));
} // writeDatabase


function hash (message) {
const _hash = crypto.createHash("sha256");
_hash.update(message);
return [..._hash.digest().values()];
} // hash

function hashMatch (h1, h2) {
if (not(h1) || not(h2) || h1.length !== h2.length) return false;

return h1.every((x, i) => x === h2[i]);
} // hashMatch 

function not (x) {return !Boolean(x);}

/// test

const info = {
firstName: "Rich", lastName: "Caloggero",
name: "rich",
eMail: "rich@somewhere.com",
password: "frog"
};

/// exports

module.exports = {
info, validateInfo, db, hash, hashMatch, readDatabase, writeDatabase, deleteAllUsers,
countUsers, getUser, login, find, add
};

