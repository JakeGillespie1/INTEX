const express = require('express');

let app = express();

let path = require('path');

let port = process.env.PORT || 3001;

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
        .orderBy('response_id', 'desc')
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
    res.render(path.join(__dirname + '/views/register'), {
        message: 'message',
    });
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

app.get('/testing', (req, res) => {
    res.render(path.join(__dirname + '/views/testing'));
});

app.get('/testing2', (req, res) => {
    res.render(path.join(__dirname + '/views/testing2'));
});

app.post('/addRecord', (req, res) => {
    let dbGender;
    let dbRelationship;
    let dbOccupation;
    let dbUseSM;
    let dbMin;
    let dbMax;

    //Gender processing
    if (req.body.sGender == 'Male') {
        dbGender = 'M';
    } else if (req.body.sGender == 'Female') {
        dbGender = 'F';
    } else if (req.body.sGender == 'Other') {
        dbGender = 'O';
    }

    //Relationship processing
    if (req.body.sRelationship == 'Single') {
        dbRelationship = 2;
    } else if (req.body.sRelationship == 'Dating') {
        dbRelationship = 1;
    } else if (req.body.sRelationship == 'Married') {
        dbRelationship = 4;
    } else if (req.body.sRelationship == 'Divorced') {
        dbRelationship = 3;
    }

    //Occupation processing
    if (req.body.sOccupation == 'School Student') {
        dbOccupation = 3;
    } else if (req.body.sOccupation == 'University Student') {
        dbOccupation = 1;
    } else if (req.body.sOccupation == 'Salaried Worker') {
        dbOccupation = 2;
    } else if (req.body.sOccupation == 'Retired') {
        dbOccupation = 4;
    }

    //I skipped organizaiton becuase you can select multiple lolz I have no idea

    //Social media use processing
    if (req.body.UseSM == 'Y') {
        dbUseSM = true;
    } else if (req.body.UseSM == 'N') {
        dbUseSM = false;
    }

    //I skipped organizaiton becuase you can select multiple lolz I have no idea

    //Occupation processing
    if (req.body.avgTime == 'less') {
        dbMin = 0;
        dbMax = 1;
    } else if (req.body.avgTime == 'oneTwo') {
        dbMin = 1;
        dbMax = 2;
    } else if (req.body.avgTime == 'twoThree') {
        dbMin = 2;
        dbMax = 3;
    } else if (req.body.avgTime == 'threeFour') {
        dbMin = 3;
        dbMax = 4;
    } else if (req.body.avgTime == 'fourFive') {
        dbMin = 4;
        dbMax = 5;
    } else if (req.body.avgTime == 'more') {
        dbMin = 5;
        dbMax = null;
    }

    let dataDate = new Date();
    dataDate =
        dataDate.getFullYear().toString() +
        '-' +
        (dataDate.getMonth() + 1).toString().padStart(2, 0) +
        '-' +
        dataDate.getDate().toString().padStart(2, 0);

    let dataDate2 = new Date();
    let dataTime =
        dataDate2.getHours().toString() +
        ':' +
        dataDate2.getMinutes().toString() +
        ':' +
        dataDate2.getSeconds().toString();

    knex('response')
        //does the table name go there^^
        .insert({
            date_stamp: dataDate,
            time_stamp: dataTime,
            age: parseInt(req.body.iAge),
            gender: dbGender,
            relationship_id: dbRelationship,
            occupation_id: dbOccupation,
            social_media_user: dbUseSM,
            min_time_online: dbMin,
            max_time_online: dbMax,
            location: 'Provo',

            frequency_used_with_purpose: parseInt(req.body.iPurpose),
            frequency_distracted_while_busy: parseInt(req.body.iDistracted),
            frequency_restless_while_not_online: parseInt(req.body.iRestless),
            scale_easily_distracted: parseInt(req.body.iEasily),
            frequency_bothered_by_worries: parseInt(req.body.iBothered),
            scale_difficulty_concentrating: parseInt(req.body.iConcentrate),
            frequency_compared_to_successful_people: parseInt(
                req.body.iCompare
            ),
            scale_feel_about_comparing_to_successful_people: parseInt(
                req.body.iFeel
            ),
            scale_seeking_validation_media_features: parseInt(
                req.body.iValidation
            ),
            frequency_depressed_or_down: parseInt(req.body.iDepressed),
            scale_interest_in_daily_activities: parseInt(req.body.iInterest),
            scale_sleep_issues: parseInt(req.body.iSleep),
        });

        let responseID;
        knex.select()
            .from('response')
            .orderBy('response_id', 'desc')
            .then((response) => {
                responseID = response[0].response_id;
            });

        let currSocials = req.body.socialmediatypes || [];

        for (let iCount = 0; iCount < currSocials.length; iCount++) {
        knex('platform_response')
            .insert ({
                platform_id: currSocials[iCount],
                response_id: responseID,
            })
            .then(() => {
                res.render(path.join(__dirname + '/views/testing2'));
            });
        };
});
/* We still need to change the variables for the survey above lolz */

app.post('/addUser', (req, res) => {
    knex('user')
        .where('email', req.body.Email)
        .then((results) => {
            if (results.length > 0) {
                // email already in db
                res.render(path.join(__dirname + '/views/register'), {
                    first_name: req.body.FirstName,
                    last_name: req.body.LastName,
                    email: req.body.Email,
                    password: req.body.Password1,
                    message: 'Error: Email already in use',
                });
            } else {
                knex('user')
                    .insert({
                        first_name: req.body.FirstName,
                        last_name: req.body.LastName,
                        email: req.body.Email,
                        password: req.body.Password1,
                        is_admin: false,
                    })
                    .then(() => {
                        res.render(path.join(__dirname + '/views/testing2'));
                    });
            }
        });
});

app.post('/userLogin', (req, res) => {
    //query that searches the database for a matching record,
    knex('user')
        .where('password', req.body.pword)
        .andWhere('email', req.body.useremail)
        .select('password', 'email', 'first_name', 'last_name', 'is_admin')
        .then((results) => {
            if (results.length == 0) {
                //user credentials invalid
                res.status(401).json({ message: 'Invalid Credentials' });
            } else {
                let sFirstName = results[0].first_name;
                let sLastName = results[0].last_name;
                let isAdmin = results[0].is_admin;

                res.render(path.join(__dirname + '/views/testing'), {
                    first_name: sFirstName,
                    last_name: sLastName,
                    is_admin: isAdmin,
                    login: 'true',
                });
            }
        });
});

app.listen(port, () => console.log('I am listening'));
