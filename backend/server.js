var express = require('express');
var app = module.exports = express();

var mongoose = require('mongoose')
	, bodyParser = require('body-parser')
	, config = require('./config.json')
	, passport = require('passport')
	, expressValidator = require('express-validator')
	, authentication = require('./middlewares/authentication')
	, oauth = require('./middlewares/authorization');

//controllers import
var userController = require('./controllers/userController')
	, clientController = require('./controllers/clientController');

mongoose.connect(config.mongodb);

//middlewares register
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(passport.initialize());

app.use(function(req, res, next) {
	res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	res.set('Access-Control-Expose-Headers', 'WWW-Authenticate');
	res.set('Access-Control-Allow-Origin', config.allowedOrigins);

	if(req.method === 'OPTIONS')
        res.sendStatus(200);
    else
    	return next();

});

app.post('/oauth/token', oauth.token)

//routes register
app.use('/user', passport.authenticate('accessToken', { session: false }), userController);
app.use('/client', clientController);

app.listen(1500, function() {
  console.log('Orb Server running on PORT 1500!');
});