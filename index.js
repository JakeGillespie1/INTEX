const express = require('express');

let app = express();

let path = require('path');

let port = process.env.PORT || 3000;

let rds_port = process.env.RDS_PORT || 5432;
let host = process.env.RDS_HOSTNAME || 'localhost';
let user = process.env.RDS_USERNAME || 'postgres';
let password = process.env.RDS_PASSWORD || 'Gabriel20!';
let database = process.env.RDS_DB_NAME || 'intex';
let ssl = process.env.DB_SSL ? { rejectUnauthorized: false } : false;

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
        ssl: ssl,
    },
});

app.get('/db', (req, res) => {
    knex.select()
        .from('response')
        .then((response) => {
            res.render(path.join(__dirname + '/views/intexData'), {
                mytest: response,
            });
        });
});

app.get('/', (req, res) => {
    res.render(path.join(__dirname + '/views/index'));
});

app.get('/login', (req, res) => {
    res.render(path.join(__dirname + '/views/login'));
});

app.get('/termsOfUse', (req, res) => {
    res.render(path.join(__dirname + '/views/termsOfUse'));
});

app.get('/contact', (req, res) => {
    res.render(path.join(__dirname + '/views/contact'));
});

app.get('/survey', (req, res) => {
    res.render(path.join(__dirname + '/views/survey'));
});

app.post("/addRecord", (req, res)=> {
    knex("record").insert({
        age: req.body.iAge,
        gender: req.body.sGender,
        rel_status: req.body.insertNameHere,
        occ_status: req.body.insertNameHere,
        organization: req.body.insertNameHere,
        org_type: req.body.insertNameHere,
        use_socials: req.body.insertNameHere ? "Y" : "N",
        socials_used: req.body.insertNameHere,
        avg_time: req.body.insertNameHere,

        purpose: req.body.insertNameHere,
        distracted: req.body.insertNameHere,
        restless: req.body.insertNameHere,
        easily_distracted: req.body.insertNameHere,
        bother_by_worries: req.body.insertNameHere,
        diff_concentrate: req.body.insertNameHere,
        compare: req.body.insertNameHere,
        feel_compare: req.body.insertNameHere,
        seek_validation: req.body.insertNameHere,
        depressed: req.body.insertNameHere,
        interest: req.body.insertNameHere,
        sleep: req.body.insertNameHere,
    }).then(mycountry => {
        res.redirect("/");
    })
 });
 /* We still need to change the variables for the survey above lolz */


app.listen(port, () => console.log('I am listening'));
