// =======================
// get the packages we need ============
// =======================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var passport       = require('passport');

var morgan         = require('morgan');
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var session        = require('express-session');
var path           = require('path');


var config   = require('./server/config'); // get our config file
var User     = require('./server/app/models/user'); // get our mongoose model
var Course   = require('./server/app/models/course'); // get our mongoose model
var Class    = require('./server/app/models/class'); // get our mongoose model
var Comment  = require('./server/app/models/comment'); // get our mongoose model
    
// =======================
// configuration =========
// =======================
mongoose.connect(config.mongo.uri, config.mongo.options); // connect to database

require('./server/config/passport')(passport); // pass passport for configuration

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// required for passport
app.use(session({ secret: 'iloveACUniversity', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

 

// =======================
// routes ================
// =======================
console.log(__dirname);
app.use(express.static(path.join(__dirname, '/public' )));

// route for home page
app.get('/', function(req, res) {
  console.log("test");
    res.sendFile('./index.html', { root: path.join(__dirname, './') });
    // console.log(req.user);
    // res.send(req.user);
});

// route for login form
// route for processing the login form
// route for signup form
// route for processing the signup form

app.get('/login', function(req, res) {
    //res.sendFile('index.html', {root: 'public/templates'}); // load the index.ejs file
});

// route for logging out
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/#/home');
});

// =====================================
// GOOGLE ROUTES =======================
// =====================================
// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// the callback after google has authenticated the user
app.get('/auth/google/callback',
    passport.authenticate('google', {
            successRedirect : '/auth/success',
            failureRedirect : '/#/login',
            failureFlash: true
    }));

app.get('/auth/success', function(req, res) {
    console.log('In auth/success, redirecting to previous page');
    res.redirect('back');
});

require('./server/app/routes/userRoutes.js')(app, User, Course);
require('./server/app/routes/courseRoutes.js')(app, Course, Class);
require('./server/app/routes/commentRoutes.js')(app, Course, Comment);

app.use(function(req, res) {
  console.error(req.stack);
  res.status(404).send('404: Page not Found');
});

// Handle 500
app.use(function(error, req, res, next) {
  console.error(error.stack);
  res.status(500).sendfile('error.html');
});

// =======================
// start the server ======
// =======================
app.listen(config.port);

console.log('Magic happens at http://localhost:' + config.port);