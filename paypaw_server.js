'use strict';

// DB etc...
const config = require('./config/config-dev.json');

const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Auth
const passport = require('passport');

// display msg in session
const flash = require('connect-flash');

const helper = require('./app/tools/helper_method');

/* ------------------------------------------- */
if (process.env.NODE_ENV == undefined) {
  process.env.NODE_ENV = 'development';
  console.log(`
================================================
|
|   Environment missing!
|
|   running default : development
|
|   NODE_ENV=development node app.js
|
================================================
` );
}

app.use(cors())

// log request to console
app.use(morgan('tiny'));

// public folder
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// to support JSON-encoded bodies (for auth)
app.use(cookieParser());

// For Passport
app.use(session({
  secret: config[process.env.NODE_ENV].session_secret,
  resave: true,
  saveUninitialized: true,
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // flash messages stored in session

/**
 *  view
 */
app.set('view engine', 'ejs');
app.set('views', './app/views');

/**
 *  models
 */
const models = require('./app/models');

/**
 *  routes
 */
// load passport strategies
require('./app/config/passport/passport.js')(passport, models.User);
require('./app/routes/auth_routes.js')(app, passport);

// API v1.0
require('./app/routes/v1_0/bills_routes.js')(app);
require('./app/routes/v1_0/user_routes.js')(app);

app.get('/api/ping', (req, res) => {
  return res.send('pong');
});

/**
 *  database
 */
models.sequelize.sync().then(function() {
  console.log('Database Connected!');
}).catch(function(err) {
  console.log(err, 'Something went wrong with the Database Update!');
});

/**
 *  Home page
 */
app.get('/', function(req, res) {
  // if user is auth in the session, carry on
  if (req.isAuthenticated()) {
    // load the index.ejs
    res.render('index.ejs', {
      user: req.user,
    });
  } else {
    res.render('index.ejs', {
      user: false,
    });
  }
});

// Route not found (404)
app.use(function(req, res, next) {

  return helper.errResp(res, 404,
    `Oh no, we lost! Route ${req.url} Not found.`);

});

// other error
app.use(function(err, req, res, next) {
  return helper.errResp(res, 500, `Error 500!! ${err}`);
});

/* Start app --------------------------------- */
const server = app.listen(port, '0.0.0.0', function() {
  let host = server.address().address;
  let port = server.address().port;

  console.log(`${process.env.NODE_ENV} running on http://${host}:${port}`);
});
