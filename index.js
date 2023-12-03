const express = require('express');

let app = express();

let path = require('path');

let port = process.env.PORT || 3000;

let rds_port = process.env.RDS_PORT || 5432;
let host = process.env.RDS_HOSTNAME || 'localhost';
let user = process.env.RDS_USERNAME || 'postgres';
let password = process.env.RDS_PASSWORD || 'Gabriel20!';
let database = process.env.RDS_DB_NAME || 'intex';

app.use(express.static(path.join(__dirname + '/public')));

app.set('views', path.join(__dirname, '/views'));

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

let knex = require('knex')({
    client: 'pg',
    connection: {
        host: host,
        user: user,
        password: password,
        database: database,
        port: rds_port,
    },
});

app.get('/db', (req, res) => {
    knex.select()
        .from('test')
        .then((test) => {
            res.render('intexData', { mytest: test });
        });
});

app.get('/', (req, res) => {
    res.render(path.join(__dirname + '/views/index.ejs'));
});

app.listen(port, () => console.log('I am listening'));
