const express = require('express');

let app = express();

let path = require('path');

let port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname + '/public')));

app.set('views', path.join(__dirname, '/views'));

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

let knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'Gabriel20!',
        database: 'bucket_list',
        port: 5432,
    },
});

app.get('/db', (req, res) => {
    knex.select()
        .from('country')
        .then((country) => {
            res.render('displayCountry', { mycountry: country });
        });
});

app.get('/', (req, res) => {
    res.render(path.join(__dirname + '/views/index.ejs'));
});

app.listen(port, () => console.log('I am listening'));
