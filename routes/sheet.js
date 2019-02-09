const router = require('express').Router();
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');

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

router.delete('/', (req, res) => {
    if (!req.body.jwtToken) {
        return res.status(200).json({
            error: true,
            errorMessage: 'Null or invalid token present in the request body'
        });
    } else {
        jwt.verify(req.body.jwtToken, process.env.JWT_KEY, (err, decoded) => {
            if (err) {
                return res.status(200).json({
                    error: true,
                    errorMessage: 'Null or invalid token present in the request body'
                });
            }

            const oAuth2Client = new google.auth.OAuth2(
                credentials.client_id, credentials.client_secret, credentials.redirect_uris
            );

            oAuth2Client.setCredentials({...credentials });

            const drive = google.drive({ version: 'v3', auth: oAuth2Client });

            drive.permissions.delete({
                resource: {
                    type: 'user',
                    role: 'writer'
                },
                permissionId: 'anyoneWithLink',
                fileId: decoded.sheetId,
                fields: 'id'
            }, (err, response) => {
                if (err) {
                    console.log('happened', err);
                    return res.status(200).json({
                        error: true,
                        errorMessage: err
                    });
                }
                return res.status(200).json({
                    error: false,
                    successMessage: 'Link sharing updated successfully.'
                });
            });

        });
    }
});

module.exports = router;