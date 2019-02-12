const router = require('express').Router();
const jwt = require('jsonwebtoken');
const changeMode = require('../controllers/changeMode');

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

            changeMode(decoded.sheetId, function(err) {
                if (err) {
                    return res.status(200).json({
                        error: true,
                        errorMessage: err
                    });
                }
                return res.status(200).json({
                    error: false,
                    successMessage: 'Link mode changed from public to private successfully.'
                });
            });
        });
    }
});

module.exports = router;