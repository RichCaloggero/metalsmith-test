const fs = require("fs");
const db = readDatabase();
const users = db.users;
const template = db.template;

const createHash = require("crypto");


function add (info) {
if (validateInfo(info) && not(getUser(info))) {
info.password = hash(info.password);
users.push(info);
db.users = users;
writeDatabase(db);
} // if
} // add

function validateInfo (info) {
return Object.keys(template).every(key =>
info.hasOwnProperty(key) && typeof(info[key]) === typeof(template[key]));
} // validateInfo

function login (nameOrEmail, password) {
password = hash(password);
const user = find("userName", nameOrEmail) || find("eMail", nameOrEmail);
return user && hashMatch(password, user.password);
} // login

function getUser (info = {}) {
const matches = Object.entries(info).map(entry => find(...entry)).flat(9);
return identical(matches);
} // validate

function find (key, value) {
return users.map(user => user[key] === value);
} // find

function identical (a) {
return a && a.length > 0? a.every((x, i, a) => x === a[0])
: false;
} // identical

function readDatabase () {
return JSON.parse(fs.readFileSync("users.json").toString());
} // readDatabase

function writeDatabase (db) {
fs.writeFileSync("users.json", JSON.stringify(db, null, 2));
} // writeDatabase


function hash (message) {
const _hash = crypto.createHash("sha256");
_hash.update(message);
return _hash.digest();
} // hash

function hashMatch (h1, h2) {
if (h1.length !== h2.length) return false;
const value1 = h1.values(), value2 = h2.values();

while (value1.next() === value2.next()) {
if (value1.done || value2.done) return false;
} // while

return true;
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
info, validateInfo, db,
getUser, login, find, add
};

