var mongoose = require('mongoose');

var chatSchema = new mongoose.Schema({
	members: {
		type: [String],
		required: true,
	},

});

var Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;