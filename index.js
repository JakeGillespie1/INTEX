const express = require("express");

let app = express();

const port = 3000;

app.set("views", path.join(__dirname, "../myviews"));

app.set("view engine", "ejs");

app.use(express.urlencoded({extended:true}));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "views/index.ejs"));
})