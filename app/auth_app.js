require('dotenv').config();

let express = require('express');
let logger = require('morgan');
let bodyParser = require('body-parser');

let auth = require('../routes/auth');


//wczytaj dotenv -> funkcje config
const debug = require('debug')('app.js');

let app = express();


app.use(logger('dev'));
app.use(bodyParser.json());

app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {

    const status = err.status || 500;
    res.status(status);
    res.send({status, message: err.message})
});

debug('process.env', {
    mongodb_uri: process.env.MONGODB_URI,
    team_name: process.env.TEAM_NAME
});
module.exports = app;
