var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
	chatId: {
		type: String,
		required: true,
	},
    //user id
    from: {
		type: String,
		required: true,
	},
	timestamp: {
		type: Number,
		required: true,
	},
    text: {
		type: String,
		required: true,
	},

});

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;