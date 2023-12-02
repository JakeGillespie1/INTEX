const express = require('express');

let app = express();

let path = require('path');

const port = 3000;

app.use(express.static(path.join(__dirname + '/public')));

app.set('views', path.join(__dirname, '/views'));

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render(path.join(__dirname + '/index.ejs'));
});

app.listen(port, () => console.log('I am listening'));
