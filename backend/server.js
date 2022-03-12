const express = require('express')
const app = express()
const router = express.Router();

app.use(express.static("site"));
app.get("/admin/*", login, require("./admin.js"));

app.listen(8000);
console.log("listening on port 8000...");


function login (req, res) {
res.sendStatus(401);
res.end();
} // login

function not (x) {return !Boolean(x);}
