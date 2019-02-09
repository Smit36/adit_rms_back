const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let AditRmsSchema = new Schema({
    subjectCode: {
        type: String
    },
    department: {
        type: String
    },
    password: {
        type: String
    },
    semester: {
        type: String
    },
    sheetData: {
        type: Object
    }
});

module.exports = mongoose.model('adit_rms', AditRmsSchema);