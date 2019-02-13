const fs = require('fs');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const changeMode = require('../controllers/changeMode');

const sessionCheck = (token) => {
    console.log('session check triggered');
    fs.readFile('routes/sessions.json', (err, data) => {
        data = JSON.parse(data);
        if (data && token) {
            for (let key in data) {
                for (let value of data[key]) {
                    if (value === token) {
                        data[key].splice(data[key].indexOf(value), 1);
                        if (!data[key].length) {
                            changeMode(key, function(err) {
                                console.log('Link mode changed from public to private successfully', err);
                            });
                        }
                    }
                }
            }
        } else if (data) {
            for (let key in data) {
                for (let value of data[key]) {
                    jwt.verify(value, process.env.JWT_KEY, (err, decoded) => {
                        const diff = moment().unix() - decoded.iat;
                        if (err || diff >= 120) {
                            data[key].splice(data[key].indexOf(value), 1);
                            if (!data[key].length) {
                                changeMode(key, function(err) {
                                    console.log('Link mode changed from public to private successfully', err);
                                });
                            }
                        }
                    });
                }
            }
        }

        for (let key in data) {
            if (!data[key].length) {
                delete data[key];
            }
        }
        data = JSON.stringify(data, null, 4);
        fs.writeFile('routes/sessions.json', data, (err) => {
            console.log('Data updated from sessionCheck');
        });

    });
}

module.exports = sessionCheck;