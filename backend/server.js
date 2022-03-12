const express = require('express')
const app = express()
const router = express.Router();

app.use(express.urlencoded());
app.use(express.static("site"));
app.get("/admin/*", login, require("./admin.js"));

app.listen(8000);
console.log("listening on port 8000...");


function login (req, res, next) {
next();
res.end();
} // login

function not (x) {return !Boolean(x);}
