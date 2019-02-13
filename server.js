const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('./db/mongoose');
const login = require('./routes/login')
const register = require('./routes/register');
const sheet = require('./routes/sheet');
const collegeData = require('./routes/collegeData');
const sessionCallback = require('./routes/sessionCallback');
const sessionCheck = require('./routes/sessionCheck');
const test = require('./routes/metaData');

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

setInterval(sessionCheck, 1000 * 60 * 2);

app.use('/user/login', login);

app.use('/college/data', collegeData);

app.use('/user/register', register);

app.use('/sheet/mode', sheet);

app.use('/session/callback', sessionCallback);

app.use('/test/code', test);  // route to check working of code

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});