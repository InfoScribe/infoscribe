
//Initial configuration
var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var bodyParser     = require('body-parser');			// To fetch data during posts
var port  	 = process.env.PORT || 8000; 				// set the port
var database = require('./config/database'); 			// load the database config

var db = mongoose.connect(database.url);	// connect to mongoDB database on modulus.io

// auth related
var passport = require('passport');
var flash 	 = require('connect-flash');
var cookieParser = require('cookie-parser');
var session      = require('express-session');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

//For loggin
var log4js = require("log4js");
var morgan = require('morgan');

// required for passport
app.use(session({ secret: 'jhhsdjakorijfsmdhtuypaswlmdjfk' })); // session secret

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


//Middle-tier configuration

app.use(bodyParser.urlencoded({ extended: false }))    // parse application/x-www-form-urlencoded
app.use(bodyParser.json())    // parse application/json
app.use(cookieParser())

//Log requests
var theAppLog = log4js.getLogger();
var theHTTPLog = morgan("combined",{
  "stream": {
    write: function(str) { theAppLog.debug(str); }
  }
});
//app.use(theHTTPLog);

//static folder
app.use(express.static(__dirname + '/public')); 	// set the static files location
app.use(express.static(__dirname + '/scripts')); 	// set the static files location

// pass passport for configuration
require('./config/passport')(passport);
require('./app/routes.js')(app,passport);


//Start the awesomeness
app.listen(8080);	
console.log('Magic happens on port 8080'); 
