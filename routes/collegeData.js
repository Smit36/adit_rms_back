const router = require('express').Router();
const rms = require('../model/user');

router.get('/', (req, res) => {
    rms.findOne({ data: 'college_branch_data' }).then(data => {
        if (data) {
            return res.status(200).json({
                error: false,
                data
            });
        } else {
            return res.status(200).json({
                error: true,
                errorMessage: 'Unable to find specified item'
            });
        }
    }).catch(err => {
        console.log(err)
        return res.status(200).json({
            error: true,
            errorMessage: 'Something unexpected happen.',
            solution: 'Something unexpected happen. See your server terminal logs to know more.'
        });
    })
});

module.exports = router;