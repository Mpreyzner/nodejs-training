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

    userView.save(function (err) {
        let message;
        let status;
        if (err) {
            if (err.code === 11000) {
                message = 'Account with given email already exist';
                status = 422;
            } else {
                message = 'Something went wrong';
                status = 500;
            }
            console.log(`Error: ${err.message}`);
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
