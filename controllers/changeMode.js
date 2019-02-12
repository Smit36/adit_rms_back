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

const changeMode = (sheetId, callback) => {
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
        fileId: sheetId,
        fields: 'id'
    }, (err, response) => {
        if (err && !err.message.includes('Permission not found: anyoneWithLink')) {
            console.error(err.message);
            return callback(err);
        }
        return callback(undefined);
    });
}

module.exports = changeMode;