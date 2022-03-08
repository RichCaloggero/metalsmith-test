const express = require('express')
const app = express()
const router = express.Router();

app.use(express.json());

app.use(express.static("site"))
app.get("/admin/*", require("./admin.js"));


app.listen(8000);
console.log("listening on port 8000...");
