var config = require('./config.json')
	, express = require('express')
	, app = module.exports = express()
	, io = require('socket.io')(config.app.socketioPort)
	, chatSocketHandler = require('./domain/chatSocketHandler')(io)
	, mongoose = require('mongoose')
	, bodyParser = require('body-parser')
	, passport = require('passport')
	, expressValidator = require('express-validator')
	, authentication = require('./middlewares/authentication')
	, oauth = require('./middlewares/authorization');

//controllers import
var userController = require('./controllers/userController')
	, clientController = require('./controllers/clientController')
	, tokenController = require('./controllers/tokenController');

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

//routes register
app.post('/oauth/token', oauth.token);
app.use('/oauth', passport.authenticate('accessToken', { session: false }), tokenController);
app.use('/user', userController);
app.use('/client', passport.authenticate('accessToken', { session: false }), clientController);

app.listen(config.app.apiPort, function(){
  console.log('Orb Server running on PORT ' + config.app.apiPort);
});