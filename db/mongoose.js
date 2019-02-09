const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB || 'mongodb://localhost/adit_rms', { useNewUrlParser: true }).then(() => {
    console.log('Connected to Database.');
}).catch(err => {
    console.log('Something went wrong while connecting to database', err);
});

mongoose.Promise = global.Promise;

module.exports = mongoose;