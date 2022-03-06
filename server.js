const express = require('express')
const app = express()
const router = express.Router();

app.use(express.static("site"))
app.use("/admin", require("./admin.js"));


app.listen(8000);
console.log("listening on port 8000...");
