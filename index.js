const express = require('express');
const { userInfo } = require('os');

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
    let selector_id = req.query.responseSelector || 'all';
    console.log('HEYHEYHEYHEY HEYHEYHEYHEY', selector_id);
    if (selector_id == 'all' || selector_id == 'View All') {
        knex.select()
            .from('response')
            .orderBy('response_id', 'desc')
            .join(
                'occupation_status',
                'response.occupation_id',
                '=',
                'occupation_status.occupation_id'
            )
            .join(
                'relationship_status',
                'response.relationship_id',
                '=',
                'relationship_status.relationship_id'
            )
            .then((response) => {
                res.render(path.join(__dirname + '/views/intexData'), {
                    mytest: response,
                });
            });
    } else {
        selector_id = parseInt(selector_id);
        knex.select()
            .from('response')
            .orderBy('response_id', 'desc')
            .join(
                'occupation_status',
                'response.occupation_id',
                '=',
                'occupation_status.occupation_id'
            )
            .join(
                'relationship_status',
                'response.relationship_id',
                '=',
                'relationship_status.relationship_id'
            )
            .where({ response_id: selector_id })
            .then((response) => {
                res.render(path.join(__dirname + '/views/intexData'), {
                    mytest: response,
                });
            });
    }
});

app.get('/', (req, res) => {
    res.render(path.join(__dirname + '/views/index'));
});

app.get('/forgotPasswordEmail', (req, res) => {
    res.render(path.join(__dirname + '/views/forgotPasswordEmail'));
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

app.get('/resetPassword', (req, res) => {
    res.render(path.join(__dirname + '/views/resetPassword'));
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

    //Social media use processing
    if (req.body.UseSM == 'Y') {
        dbUseSM = true;
    } else if (req.body.UseSM == 'N') {
        dbUseSM = false;
    }

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
        })
        .then(() => {
            let responseID;
            knex.select()
                .from('response')
                .orderBy('response_id', 'desc')
                .then((response) => {
                    responseID = response[0].response_id;

                    let currSocials = req.body.socialmediatypes || [];
                    let currOrgs = req.body.sOrganization || [];

                    async function createPlatResponse(currPlatform) {
                        await knex('platform_response').insert({
                            platform_id: currPlatform,
                            response_id: responseID,
                        });
                    }

                    async function createOrgResponse(currOrg) {
                        await knex('organization_response').insert({
                            org_id: currOrg,
                            response_id: responseID,
                        });
                    }

                    Promise.all(
                        currSocials.map((currPlatform) =>
                            createPlatResponse(currPlatform)
                        )
                    );

                    Promise.all(
                        currOrgs.map((currOrg) => createOrgResponse(currOrg))
                    );

                    res.render(path.join(__dirname + '/views/testing2'));
                });
        });
});

app.get('/forgotPW', (req, res) => {
    res.render(path.join(__dirname + '/views/forgotPasswordEmail'), {
        message: 'message',
    });
});

app.post('/updatePW', (req, res) => {
    knex('user')
    .where('email', req.body.nameemail)
    .update({ password : req.body.Password1})
    .then(userInfo => {
        res.render(path.join(__dirname + '/views/testing2'));
    });
    });

app.post('/emailPW', (req, res) => {
    knex.select('password', 'email').from('user')
        .where('email', req.body.useremail)
        .then((results) => {
            if (results.length == 0) {
                // email not in db
                res.render(
                    path.join(__dirname + '/views/forgotPasswordEmail'),
                    {
                        message: 'Error: User email does not exist',
                    }
                );
            } else {
                res.render(path.join(__dirname + '/views/resetPassword'), {userInfo : results});
            }
        });
});

/*Admin Update Users*/
app.post('/updateUserAdmin', (req, res) => {
    knex('user')
    .where('email', req.body.nameemail)
    .update({ password : req.body.Password1})
    .then(userInfoAdmin => {
        res.render(path.join(__dirname + '/views/userData'));
    });
    });

app.get('/showUsers', (req, res) => {
    knex.select('*').from('user')
        .then((results) => {
            res.render(path.join(__dirname + '/views/userData'), {userInfoAdmin : results});
        });
});

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
