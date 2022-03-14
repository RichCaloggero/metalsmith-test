const express = require('express')
const app = express()
const router = express.Router();
const auth = require("./auth.js");
const admin = require ("./admin.js");

app.use(express.urlencoded({extended: true}));
app.use(express.static("site"));
app.get("/admin/*", admin.login, admin.editFile);
app.post("/login", admin.authenticate);


app.listen(8000);
console.log("listening on port 8000...");



function not (x) {return !Boolean(x);}
