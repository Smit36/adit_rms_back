// CREATING SPREADSHEET
// const oAuth2Client = new google.auth.OAuth2(
//     credentials.client_id, credentials.client_secret, credentials.redirect_uris
// );

// oAuth2Client.setCredentials({...credentials });

// const sheet = google.sheets({ version: 'v4', auth: oAuth2Client });
// sheet.spreadsheets.developerMetadata.get({
//     spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
//     fields: 'visibility'
// }, (err, response) => {
//     console.log(err, response);
// });

// sheet.spreadsheets.values.get({
//     spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
//     range: 'Class Data!A2:E'
// }, (err, response) => {
//     if (err) {
//         return console.log(err);
//     }
//     const rows = response.data.values;
//     if (rows.length) {
//         console.log('Name, Major:');
//         // Print columns A and E, which correspond to indices 0 and 4.
//         rows.map((row) => {
//             console.log(`${row[0]}, ${row[4]}`);
//         });
//     } else {
//         console.log('No data found.');
//     }
// });

// PERMISSIONS ON SPREADSHEET
// const oAuth2Client = new google.auth.OAuth2(
//     credentials.client_id, credentials.client_secret, credentials.redirect_uris
// );

// oAuth2Client.setCredentials({...credentials });

// const drive = google.drive({ version: 'v3', auth: oAuth2Client });

// drive.permissions.delete({
//     resource: {
//         type: 'user',
//         role: 'writer'
//     },
//     permissionId: 'anyoneWithLink',
//     fileId: '1sC2Mn4JidMaHGmduzYrqGug50-Y4ISYxLVPIFQBBi_M',
//     fields: 'id'
// }, (err, response) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(response);
// });

// return res.status(200).json({
//     success: 'wonderful'
// });