var config = require('../config.json')
    , redis = require('redis')
    , sub = redis.createClient(config.redis.port, config.redis.host)
	, pub = redis.createClient(config.redis.port, config.redis.host)
    , storage = redis.createClient(config.redis.port, config.redis.host)
    , utils = require("../helpers/utils")

//It's limited to ten listeners. Zero means infinity
sub.setMaxListeners(0);

var chatSocketHandler = function(socket) {
    socket.emit('hello', { message: 'Hello World!' });
}

module.exports = chatSocketHandler;