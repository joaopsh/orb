var mongoose = require('mongoose');

var clientSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	clientId: {
		type: String,
		required: true,
	},
	clientSecret: {
		type: String,
		required: true,
	},
	isTrusted: {
		type: Boolean,
		required: true,
		default: false,
	},
	allowedOrigin: {
		type: String,
		required: true,
	}

});

var Client = mongoose.model('Client', clientSchema);

module.exports = Client;