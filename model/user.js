const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let AditRmsSchema = new Schema({
    subjectCode: {
        type: String
    },
    password: {
        type: String
    },
    sheetData: {
        type: Object
    }
});

module.exports = mongoose.model('adit_rms', AditRmsSchema);