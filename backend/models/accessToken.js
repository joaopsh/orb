var mongoose = require('mongoose')
	, bcrypt = require('bcrypt');

var accessTokenSchema = new mongoose.Schema({
	token: {
		type: String,
		required: true,
	},
	expirationDate: {
		type: Date,
		required: true,
	},
	clientId: {
		type: String,
		required: true,
	},
	userEmail: {
		type: String,
		required: true,
	},
	scope: {
		type: String,
		default: '*',
	},
});

var AccessToken = mongoose.model('AccessToken', accessTokenSchema);

module.exports = AccessToken;