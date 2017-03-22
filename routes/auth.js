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
        let duplicateKeyError = db.ERR_CODES.DUPLICATE_KEY_ERROR;
        let errors = {
            default: {
                http_code: 500,
                //  message: 'Something went wrong'
            }
        };

        errors[duplicateKeyError] = {
            http_code: 422,
            // message: 'Account with given email already exist'
        };

        if (err) {
            if (errors.hasOwnProperty(err.code)) {

                status = 422;
                status = errors[err.code].http_code;
            } else {
                status = 500;

            }

        } else {
            // message = 'User created';
            status = 204;
        }
        res.status(status);
        res.send();
        // db.
    });

    // const status = 204;
    // res.status(status);
    // res.send();

});

module.exports = router;
