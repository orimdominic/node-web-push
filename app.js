var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
require('dotenv').config()
const cors = require('cors')
const webpush =require('web-push')

const pubKey = process.env.PUBLIC_KEY
const privKey = process.env.PRIVATE_KEY

webpush.setVapidDetails('mailto:test@mail.com', pubKey, privKey)

var notificationsRouter = require('./routes/notifications');

var app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/notifications', notificationsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
