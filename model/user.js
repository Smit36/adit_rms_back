const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    username: {
        type: String,
        minlength: 3,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    profileImage: {
        type: String,
    },
    accountType: {
        type: String,
        required: true,
        default: 'user'
    }
});

module.exports = mongoose.model('User', UserSchema);