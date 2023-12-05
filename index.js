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

app.get('/dashboard', (req, res) => {
    res.render(path.join(__dirname + '/views/dashboard'));
});

app.get('/login', (req, res) => {
    res.render(path.join(__dirname + '/views/login'));
});

app.get('/register', (req, res) => {
    res.render(path.join(__dirname + '/views/register'));
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

app.post('/addRecord', (req, res) => {
    knex('record')
        .insert({
            age: parseInt(req.body.iAge),
            gender: req.body.sGender,
            rel_status: req.body.sRelationship,
            occ_status: req.body.sOccupation,
            organization: req.body.sOrganization,
            use_socials: req.body.UseSM ? 'Y' : 'N',
            socials_used: req.body.socialmediatypes,
            avg_time: req.body.avgTime,

            purpose: parseInt(req.body.iPurpose),
            distracted: parseInt(req.body.iDistracted),
            restless: parseInt(req.body.iRestless),
            easily_distracted: parseInt(req.body.iEasily),
            bother_by_worries: parseInt(req.body.iBothered),
            diff_concentrate: parseInt(req.body.iConcentrate),
            compare: parseInt(req.body.iCompare),
            feel_compare: parseInt(req.body.iFeel),
            seek_validation: parseInt(req.body.iValidation),
            depressed: parseInt(req.body.iDepressed),
            interest: parseInt(req.body.iInterest),
            sleep: parseInt(req.body.iSleep),
        })
        .then((mycountry) => {
            res.redirect('/');
        });
});
/* We still need to change the variables for the survey above lolz */

app.post('/addUser', (req, res) => {
    knex('user')
        .insert({
            first_name: req.body.useremail,
            last_name: req.body.sGender,
            email: req.body.useremail,
            password: 'hi',
        })
        .then((mycountry) => {
            res.redirect('/');
        });
});

app.post('/userLogin', (req, res) => {
    //query that searches the database for a matching record,
    knex('user')
        .where('password', req.body.pword)
        .andWhere('email', req.body.useremail)
        .select('password', 'email", "first_name", "last_name')
        .then((results) => {
            if (results.length > 0) {
                //user credentials are valid...store info to local storage
                localStorage.setItem('password', req.body.pword);
                localStorage.setItem('email', req.body.useremail);
                localStorage.setItem('firstname', first_name);
                localStorage.setItem('lastname', last_name);

                res.redirect(path.join(__dirname + '/views/index'));
            } else {
                //user credentials invalid
                res.status(401).json({ message: 'Invalid Credentials' });
            }
        });
});

app.listen(port, () => console.log('I am listening'));
