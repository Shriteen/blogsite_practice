var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

const mongoose= require('mongoose');
mongoose.set('strictQuery',false);
const mongodb='mongodb://127.0.0.1/blogsite';




var indexRouter = require('./routes/index');
const adminRouter = require('./routes/admins')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// things inside public directory can be accessed both as if at server root or with explicit prefix 'public/'
app.use('/public',express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secret',
    store: new MongoDBStore({
	uri: 'mongodb://127.0.0.1:27017',
	databaseName: 'blogsite',
	collection: 'adminSessions'
    }),
    resave: true,
    saveUninitialized: true
}));



app.use('/', indexRouter);
app.use('/admin', adminRouter);

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

main().catch(err=> console.log(err));

async function main()
{
    await mongoose.connect(mongodb);
}

module.exports = app;
