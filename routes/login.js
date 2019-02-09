const router = require('express').Router();
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const rms = require('../model/user');

const credentials = {
    client_id: process.env.SPREADSHEET_CLIENT_ID,
    client_secret: process.env.SPREADSHEET_CLIENT_SECRET,
    redirect_uris: process.env.SPREADSHEET_REDIRECT_URI,
    access_token: process.env.SPREADSHEET_ACCESS_TOKEN,
    refresh_token: process.env.SPREADSHEET_REFRESH_TOKEN,
    scope: process.env.SPREADSHEET_SCOPE,
    token_type: process.env.SPREADSHEET_TOKEN_TYPE,
    expiry_date: process.env.SPREADSHEET_EXPIRY_DATE,
}

router.post('/', (req, res) => {
    const userData = {
        department: req.body.department,
        semester: req.body.semester,
        subjectCode: req.body.subjectCode,
        password: req.body.password
    }

    if (!userData.department) {
        return res.status(200).json({
            error: true,
            errorMessage: 'Valid department is required',
            errorType: 'department'
        })
    } else if (userData.semester < 1 && userData.semester > 8) {
        return res.status(200).json({
            error: true,
            errorMessage: 'Valid semester is required',
            errorType: 'semester'
        });
    } else if (!userData.subjectCode) {
        return res.status(200).json({
            error: true,
            errorMessage: 'Valid subject code is required',
            errorType: 'subjectCode'
        });
    } else {
        rms.findOne({
            department: userData.department,
            semester: userData.semester,
            subjectCode: userData.subjectCode
        }).then(data => {
            if (data) {
                if (data.password !== userData.password) {
                    return res.status(200).json({
                        error: true,
                        errorMessage: 'Not a valid password'
                    });
                } else {
                    const oAuth2Client = new google.auth.OAuth2(
                        credentials.client_id, credentials.client_secret, credentials.redirect_uris
                    );

                    oAuth2Client.setCredentials({...credentials });

                    const drive = google.drive({ version: 'v3', auth: oAuth2Client });

                    drive.permissions.create({
                        resource: {
                            type: 'anyone',
                            role: 'writer'
                        },
                        fileId: data.sheetData.sheetId,
                        fields: 'id'
                    }, (err, response) => {
                        if (err) {
                            return res.status(200).json({
                                err: true,
                                errorMessage: err
                            });
                        }
                        const jwtPayload = {
                            department: userData.department,
                            semester: userData.semester,
                            subjectCode: userData.subjectCode,
                            sheetId: data.sheetData.sheetId
                        }
                        let token = jwt.sign(jwtPayload, process.env.JWT_KEY, { expiresIn: '1h' });
                        return res.status(200).json({
                            error: false,
                            url: data.sheetData.url,
                            jwtToken: token
                        });
                    });
                }
            } else {
                return res.status(200).json({
                    error: true,
                    errorMessage: 'Unable to find specified item'
                });
            }
        }).catch(err => {
            console.log("Something unexpected happen. See your server terminal logs to know more: ", err)
            return res.status(200).json({
                error: true,
                errorMessage: 'Not a valid password',
                solution: 'Something unexpected happen. See your server terminal logs to know more.'
            });
        })
    }
});

module.exports = router;