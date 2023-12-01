const express = require("express");

let app = express();

const port = 3000;

/*this makes the body attribute visible in the request*/
app.use(express.urlencoded({extended:true}));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"));
})