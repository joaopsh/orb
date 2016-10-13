var auth = require('socketio-auth')
    , crypto = require('crypto')
    , User = require('../models/user')
    , AccessToken = require('../models/accessToken')
    , chatSocketHandler = require('./chatSocketHandler');

var socketBootstrap = function(io) {
    //creates a namespace called "chat"
    var chat = io.of('/chat');

    //chat authentication
    auth(chat, {
        authenticate: function (socket, data, callback) {
            if(!data.credentials || !data.credentials.access_token)
                return callback(new Error("Invalid access token"));

            var accessTokenHash = crypto.createHash('sha1').update(data.credentials.access_token).digest('hex');

            AccessToken.findOne({ token: accessTokenHash }, function(err, accessToken) {
                if(err)
                    return callback(new Error("Internal server error."));

                if(!accessToken)
                    return callback(new Error("Access token not found."));

                
                if (new Date() > accessToken.expirationDate)
                    return callback(new Error("Expired access token."));

                User.findOne({ email: accessToken.userEmail }, function (err, user) {
                    if (err)
                        return callback(new Error("Internal server error."));

                    if (!user)
                        return callback(new Error("User not found."));

                    //bind the user informations with the socket
                    socket.user = {
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName
                    }

                    return callback(null, true);
                });
            });
            
        },
        postAuthenticate: function(socket, data) {
            chatSocketHandler(socket);
        },
        timeout: 1000 * 10
    });
}

module.exports = socketBootstrap;