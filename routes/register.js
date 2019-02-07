const router = require('express').Router();
const validator = require('validator');
const bcrypt = require('bcryptjs');

const User = require('../model/user');
const regEx = '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})';

router.post('/', (req, res) => {
    if (!validator.isEmail(req.body.email)) {
        return res.status(200).json({
            errorMessage: 'not a valid email.',
            errorEmail: true
        });
    } else if (!validator.matches(req.body.password, regEx)) {
        return res.status(200).json({
            errorMessage: 'password should be 6 characters long and should include at least one uppercase letter or numeric character.',
            errorPassword: true
        });
    } else if (req.body.password !== req.body.confirmPassword) {
        return res.status(200).json({
            errorMessage: 'both passwords should match.',
            errorConfirmPassword: true
        });
    } else if (req.body.accountType !== 'user' && req.body.accountType !== 'professor' && req.body.accountType !== 'admin') {
        return res.status(200).json({
            errorMessage: 'invalid account type. It should be either user, professor or admin',
            errorAccountType: true
        });
    } else {
        User.findOne({ email: req.body.email }).then(result => {
            if (result) {
                return res.status(200).json({
                    errorMessage: 'user already exist.',
                    errorEmail: true
                });
            } else {
                let userObj = {
                    email: req.body.email,
                    username: req.body.username,
                    password: req.body.password,
                    accountType: req.body.accountType
                };
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) {
                        return res.status(200).json({
                            error: true,
                            errorMessage: err.message
                        });
                    } else {
                        bcrypt.hash(req.body.password, salt, (err, hash) => {
                            if (err) {
                                return res.status(200).json({
                                    error: true,
                                    errorMessage: err.message
                                });
                            } else {
                                userObj.password = hash;
                                new User(userObj).save().then(() => {
                                    return res.status(200).json({
                                        success: true,
                                        successMessage: 'user created successfully.'
                                    });
                                }).catch(error => {
                                    return res.status(200).json({
                                        error: true,
                                        errorMessage: error.message
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});

module.exports = router;