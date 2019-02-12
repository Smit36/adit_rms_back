const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('./db/mongoose');
const login = require('./routes/login')
const register = require('./routes/register');
const sheet = require('./routes/sheet');
const collegeData = require('./routes/collegeData');
const sessionCallback = require('./routes/sessionCallback');
const sessionCheck = require('./routes/sessionCheck');

// const rms = require('./model/user');

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS - Cross Origin Resource Sharing
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// setInterval(sessionCheck, 60 * 1000);

app.use('/user/login', login);

app.use('/college/data', collegeData);

app.use('/user/register', register);

app.use('/sheet/mode', sheet);

app.use('/session/callback', sessionCallback);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

// app.get('/', (req, res) => {
//     const user = new rms({
//         subjectCode: '2160711',
//         department: 'computer_engineering',
//         password: 'something',
//         semester: '5',
//         sheetData: {
//             url: 'https://docs.google.com/spreadsheets/d/1sC2Mn4JidMaHGmduzYrqGug50-Y4ISYxLVPIFQBBi_M/',
//             sheetId: '1sC2Mn4JidMaHGmduzYrqGug50-Y4ISYxLVPIFQBBi_M'
//         }
//     });
//     user.save().then(response => {
//         console.log(response);
//     }).catch(err => {
//         console.log(err);
//     })
//     return res.status(200).json({
//         success: 'wonderful'
//     });
// });