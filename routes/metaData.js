const router = require('express').Router();
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const uuid = require('uuid/v1');

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
    const oAuth2Client = new google.auth.OAuth2(
        credentials.client_id, credentials.client_secret, credentials.redirect_uris
    );

    oAuth2Client.setCredentials({...credentials });

    const sheets = google.sheets('v4');
    const sheetId = '1sC2Mn4JidMaHGmduzYrqGug50-Y4ISYxLVPIFQBBi_M';
    var request = {
        spreadsheetId: sheetId,
        auth: oAuth2Client
    }

    sheets.spreadsheets.get(request, function(err, response) {
        return res.status(200).json({
            err,
            response
        })
    });
});
module.exports = router;