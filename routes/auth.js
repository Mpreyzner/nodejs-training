let express = require('express');
let router = express.Router();

router.post('/', function (req, res, next) {


    const db = req.app.get('db')
        , UserAuth = db.getModel('user_auth')
        , userAuth = new UserAuth(req.body)
    ;

    let errors = {};

    userAuth.save(function (err) {

        let status;
        let currentError;
        
        if (err) {
            // if (errors.hasOwnProperty(err.code)) {
            //     currentError = errors[err.code];
            // } else {
            //     currentError = 'default';
            // }
            // //message = currentError.message;
            // status = currentError.http_code;
            status = 500;
        } else {
            // message = 'User created';
            status = 204;
        }
        res.status(status);
        res.send();
    });

    // const status = 204;
    // res.status(status);
    // res.send();

});

module.exports = router;
