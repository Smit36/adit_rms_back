const router = require('express').Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const uuid = require('uuid/v1');

const sessionCheck = require('./sessionCheck');

router.post('/', (req, res) => {
    const jwtToken = req.body.jwtToken;
    jwt.verify(jwtToken, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            sessionCheck(jwtToken);
            return res.status(200).json({
                error: true,
                errorMessage: 'Token expired or either the token is invalid.'
            });
        } else {
            const sheetId = decoded.sheetId;
            const payload = {
                department: decoded.department,
                semester: decoded.semester,
                subjectCode: decoded.subjectCode,
                id: uuid(),
                sheetId: decoded.sheetId
            }
            const newToken = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: 60 * 1 });
            fs.readFile('routes/sessions.json', (err, data) => {
                if (err) {
                    return res.status(200).json({
                        error: true,
                        errorMessage: 'Error while reading session file. Please try again later.'
                    });
                } else {
                    data = JSON.parse(data);
                    if (data[sheetId]) {
                        data[sheetId][data[sheetId].indexOf(jwtToken)] = newToken
                    } else {
                        return res.status(200).json({
                            error: true,
                            errorMessage: 'Token not found'
                        });
                    }
                    data = JSON.stringify(data, null, 4);
                    fs.writeFile('routes/sessions.json', data, (err) => {
                        if (err) {
                            return res.status(200).json({
                                error: true,
                                errorMessage: 'Error while writing session in session file. Please try again later.'
                            });
                        } else {
                            return res.status(200).json({
                                error: false,
                                jwtToken: newToken
                            });
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;