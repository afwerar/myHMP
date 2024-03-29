var express = require('express');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var pconfig = require('./database/dbmtools');

var index = require('./routes/index');
var users = require('./routes/users');
var serialportcom = require('./routes/serialportcom');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('.html', require('ejs').__express);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// var connection = mysql.createConnection(pconfig.getSessionOptions());

// connection.connect();
// //查询
// connection.query('select * from `test`', function(err, rows, fields) {
//   if (err) throw err;
//   console.log('查询结果为: ', rows);
// });
// //关闭连接
// connection.end();
// var sessionStore = new MySQLStore({}, connection);
var sessionStore = new MySQLStore(pconfig.getSessionOptions());

// app.use(session({
//   key: 'session_cookie_name',
//   secret: 'session_cookie_secret',
//   store: sessionStore,
//   resave: true,
//   saveUninitialized: true
// }));
app.use(session({
  secret: '12345',
  name: 'testapp',
  cookie: { path: '/', httpOnly: true, secure: false, maxAge: 80000 },
  resave: true,
  saveUninitialized: true,
  store: sessionStore
}));

app.use('/', index);
app.use('/users', users);
app.use('/serialportcom', serialportcom);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
