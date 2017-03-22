let express = require('express');
let router = express.Router();

/* GET home page. */
router.post('/', function (req, res, next) {
    const status = 204;
    res.status(status);
    res.send();

});

module.exports = router;
