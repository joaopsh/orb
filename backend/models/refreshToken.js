var mongoose = require('mongoose')
	, bcrypt = require('bcrypt');

var refreshTokenSchema = new mongoose.Schema({
	token: {
		type: String,
		required: true,
	},
	clientId: {
		type: String,
		required: true,
	},
	userEmail: {
		type: String,
		required: true,
	}
});

var RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

module.exports = RefreshToken;