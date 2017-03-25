const express = require('express')
    , router = express.Router()
    , bcrypt = require('bcryptjs')
    , async = require('async')
;

router.post('/', function (req, res, next) {


    const db = req.app.get('db')
        , UserAuth = db.getModel('user_auth')
        , userAuth = new UserAuth(req.body)
    ;

    let errors = {};

    async.waterfall([
        (next) => {
            bcrypt.hash(userAuth.password, 10, (err, hashedPassword) => {
                if (err) {
                    console.log(err.message);
                    return next(err);
                }
                userAuth.password = hashedPassword;
                return next();
            });
        },

        (next) => {
            userAuth.save(function (err) {
                userAuth.password = bcrypt.hash(userAuth.password, 10, (err, hashedPassword) => {
                        userAuth.password = hashedPassword;

                    }, function (next) {
                        console.log(userAuth);
                        next();
                    }
                );
                let status;
                let duplicateKeyError = db.ERR_CODES.DUPLICATE_KEY_ERROR;
                let errors = {
                    default: {
                        http_code: 500,
                    }
                };

                errors[duplicateKeyError] = {
                    http_code: 422,
                };

                if (err) {
                    console.log(err);
                    if (errors.hasOwnProperty(err.code)) {
                        status = errors[err.code].http_code;
                    } else {
                        status = 500;
                    }
                } else {
                    status = 204;
                }
                res.status(status);
                res.send();
            });
        }

    ], (err) => {
        if (err) {
            process.exit(1);
        }
    });


});

module.exports = router;
