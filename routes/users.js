let express = require('express');
let router = express.Router();
let async = require('async');
let request = require('request');
let _ = require('lodash');
let Publisher = require('../lib/rabbit_mq/publisher.js');


/* GET users listing. */
router.get('/', function(req, res, next) {

    const status = 201;
    res.status(status);
    res.message('User created');

    res.send({status, message: res.message})
});

router.post('/', function (req, res, n) {


    const db = req.app.get('db')
        , UserView = db.getModel('user_view')
        , userView = new UserView(req.body)
    ;

    const rabbitMq = req.app.get('rabbitMq');

    let duplicateKeyError = db.ERR_CODES.DUPLICATE_KEY_ERROR;
    let errors = {
        default: {
            http_code: 500,
            message: 'Something went wrong'
        }
    };

    errors[duplicateKeyError] = {
        http_code: 422,
        message: 'Account with given email already exist'
    };

    async.waterfall([
        (next) => {
            userView.save(function (err) {
                let message;
                let status;
                let currentError;

                if (err) {
                    if (errors.hasOwnProperty(err.code)) {
                        currentError = errors[err.code];
                    } else {
                        currentError = 'default';
                    }
                    message = currentError.message;
                    status = currentError.http_code;
                    console.error(err);
                    return next(err);
                } else {
                    next();
                }
            });
        },

        (next) => {
            let password = req.body.password;
            let body = {
                username: userView.email,
                password
            };

            let uri = process.env.AUTH_SERVICE_URL + '/auth';
            let opts = {
                method: 'POST',
                uri,
                json: body
            };

            request(opts, (err, res, body) => {
                if (err) {
                    console.error(err);
                    return next(err);
                }
                let statusCode = res.statusCode;

                if (statusCode === 204) {
                    message = 'User created';
                    status = 201;
                } else {
                    message = 'oops something went wrong';
                    status = 422;
                }

                next();
            });


        },
        // (next) => {
        //     // publisher.publish(
        //     //     'user_registration_event',
        //     //     _.pick(req.body, ['email', 'firstname', 'lastname']), {
        //     //         deliveryMode: 2,
        //     //         mandatory: true
        //     //     }, (err) => {
        //     //         if (err) {
        //     //             return next(err);
        //     //         }
        //     //         next(null);
        //     //     });
        // }

    ], (err) => {
        if (err) {
            message = err.message;
            status = 500;
            process.exit(1);
        }
        res.status(status);
        res.send({status, message});
    });


    // status: status equals to status
});
module.exports = router;
