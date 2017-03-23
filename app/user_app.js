require('dotenv').config();

let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let index = require('../routes/index');
let users = require('../routes/users');

//wczytaj dotenv -> funkcje config
const debug = require('debug')('app.js');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', index);
app.use('/users', users);

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
    team_name: process.env.TEAM_NAME,
    rabbitmq_uri: process.env.RABBITMQ_URI
});
module.exports = app;
