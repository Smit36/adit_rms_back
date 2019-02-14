const router = require('express').Router();
const { google } = require('googleapis');

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
    let spreadsheetId = req.body.spreadsheetId;
    let sheetId = req.body.sheetId;
    let spreadsheetTitle, sheetTitle;

    // get metadata of spreadsheet that you want to copy
    sheets.spreadsheets.get({ spreadsheetId, auth: oAuth2Client }, (err, response) => {
        if (err) {
            return res.status(200).json({
                error: true,
                errorMessage: err
            });
        }

        // get the title of that spreadsheet
        spreadsheetTitle = response.data.properties.title;
        response.data.sheets.forEach((value) => {
            if (value.properties.sheetId == sheetId) {

                // get the title of sheet specified by sheetId that you are going to copy
                sheetTitle = value.properties.title;
            }
        });

        // create a new spreadsheet
        sheets.spreadsheets.create({ auth: oAuth2Client }, (err, response) => {
            if (err) {
                return res.status(200).json({
                    error: true,
                    errorMessage: err
                });
            }

            // get the id of newly created spreadsheet
            const destinationSpreadsheetId = response.data.spreadsheetId;
            const copySheet = {
                spreadsheetId,
                sheetId,
                resource: {
                    destinationSpreadsheetId
                },
                auth: oAuth2Client
            }

            // copy the sheet specified by sheetId from spreadsheetId to destinationSpreadsheetId
            sheets.spreadsheets.sheets.copyTo(copySheet, (err, response) => {
                if (err) {
                    return res.status(200).json({
                        error: true,
                        errorMessage: err
                    });
                }

                // get the title of sheet specified by sheetId that you are going to copy
                sheetId = response.data.sheetId;

                // remove the by default sheet created when creating new spreadsheet and also update the name of sheet that was just copied as well as update the name of spreadsheet
                const update = {
                    spreadsheetId: destinationSpreadsheetId,
                    resource: {
                        requests: [{
                            deleteSheet: {
                                sheetId: 0
                            }
                        }, {
                            updateSheetProperties: {
                                properties: {
                                    sheetId,
                                    title: sheetTitle
                                },
                                fields: 'title'
                            }
                        }, {
                            updateSpreadsheetProperties: {
                                properties: {
                                    title: spreadsheetTitle,
                                },
                                fields: 'title'
                            }
                        }]
                    },
                    auth: oAuth2Client
                }

                sheets.spreadsheets.batchUpdate(update, (err, response) => {
                    if (err) {
                        return res.status(200).json({
                            error: true,
                            errorMessage: err
                        });
                    }

                    return res.status(200).json({
                        error: false,
                        successMessage: response
                    });
                });

            });
        });

    });
});
module.exports = router;