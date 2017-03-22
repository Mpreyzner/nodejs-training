let express = require('express');
let router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

    //  res.send('respond with a resource');
    const status = 201;
    res.status(status);
    res.message('User created');

    res.send({status, message: res.message})
});

router.post('/', function (req, res, next) {


    const db = req.app.get('db')
        , UserView = db.getModel('user_view')
        , userView = new UserView(req.body)
    ;

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
        } else {
            message = 'User created';
            status = 201;
        }
        res.status(status);
        res.send({status, message})
    });


    // status: status equals to status
});
module.exports = router;
