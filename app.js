var express = require('express');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
require('./config/passport');
var session = require('express-session');
var sessionRouter = require('./routes/session');
const auth = require('./middlewares/auth');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var usersFromDb = require('./routes/usersFromDb');
var allPosts =  require('./routes/allPosts');
var authRouter = require('./routes/auth');
var vacancyRouter = require('./routes/vacancy');
var app = express();
var database = require('./database/db');
database.connectToDatabase(process.env.DB_URL);
const createError = require('http-errors');
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session(
  {
    secret: 'secret',
    key: 'session_key',
    cookie: {
      httpOnly: false
    },
    resave: true,
    saveUninitialized: true
  }
));
app.use('/users', usersRouter);
app.use('/session', sessionRouter);

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  if(err.status == 401) {
    res.redirect('/auth/login')
  }
  res.status(err.status || 500);
  res.render('error');
});

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// Connect to Mongo DB
let db;
MongoClient.connect('mongodb://localhost:27017/users', function (err, database) {
  console.log("Connected Successfully!!!");
  db = database.db('users');
})

//Make the db accessible to all the routes
app.use(function (req, res, next) {
  req.db = db;
  next();
})

app.use('/vacancy',auth.isAuthenticated(), vacancyRouter);
app.use('/auth',authRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  if(err.status == 401) {
    res.redirect('/auth/login')
  }
  if(err.status == 402) {
    res.render('partials/pageNotFound',{loggedIn:false});
  }
  if(req.status == 401) {
    res.redirect('/auth/login')
  }
  res.status(err.status || 500);
  res.render('partials/pageNotFound',{loggedIn:false});
});

module.exports = app;
