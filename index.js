const express = require('express');

let app = express();

let path = require('path');

const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname + '/public')));

app.set('views', path.join(__dirname, '/views'));

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/index.ejs'));
});

app.listen(port, () => console.log('I am listening'));
