const fs = await import("fs");
const db = readDatabase();
const template = db.template;
const crypto = await import("crypto");


export function deleteAllUsers () {
db.users = {};
writeDatabase(db);
} // deleteAllUsers

export function countUsers () {
return Object.keys(db.users);
} // countUsers

export function addUser (info) {
if (validateInfo(info) && not(getUser(info.eMail))) {
const newInfo = Object.assign({}, info);
newInfo.password = hash(info.password);
db.users[info.eMail] = newInfo;
console.log("added user ", info.eMail, ", ", db.users[info.eMail]);
writeDatabase(db);
return true;
} // if

return false;
} // addUser

export function updateUserInfo (info) {
const oldInfo = validateInfo(info)? getUser(info.eMail) : null;
console.log("updating user ", oldInfo, " with ", info);
if (oldInfo) {
const newInfo = Object.assign({}, oldInfo, info);
newInfo.password = hash(info.password);
console.log("updateUserInfo: ", oldInfo, ", ", newInfo);
db.users[info.eMail] = newInfo;
writeDatabase(db);
return true;
} // if

return false;
} // updateUserInfo

export function validateInfo (info) {
return Object.keys(template).every(key =>
info.hasOwnProperty(key) && typeof(info[key]) === typeof(template[key]));
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


export function hash (message) {
const _hash = crypto.createHash("sha256");
_hash.update(message);
return [..._hash.digest().values()];
} // hash

export function hashMatch (h1, h2) {
if (not(h1) || not(h2) || h1.length !== h2.length) return false;

return h1.every((x, i) => x === h2[i]);
} // hashMatch 

function not (x) {return !Boolean(x);}

