let express = require('express');
let router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

    const status = 201;
    res.status(status);
    res.message('User created');

    res.send({status, message: res.message})
});

router.post('/', function (req, res, next) {

    const status = 201;
    res.status(status);
    const message = 'User created';

    res.send({status, message})
    // status: status equals to status
});
module.exports = router;
