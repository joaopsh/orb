var passport = require('passport')
    , auth = require('socketio-auth')
    , crypto = require('crypto')
    , AccessToken = require('../models/accessToken');

module.exports = function(io) {
    var chat = io.of('/chat');

    auth(chat, {
        authenticate: function (socket, data, callback) {
            if(! data.auth || !data.auth.access_token)
                return callback(new Error("Invalid access token"));

            var accessTokenHash = crypto.createHash('sha1').update(data.auth.access_token).digest('hex');

            AccessToken.findOne({ token: accessTokenHash }, function(err, accessToken) {
                if(err)
                    return callback(new Error("Internal server error."));

                if(!accessToken)
                    return callback(new Error("Access token not found."));

                
                if (new Date() > accessToken.expirationDate)
                    return callback(new Error("Expired access token."));

                return callback(null, true);
            });
            
        },
        postAuthenticate: function(socket, data) {
            
            // setInterval(function() {
            //     chat.emit('tweet', {
            //         user: 'joaopsh',
            //         message: 'Orb Online!'
            //     });
            // }, 3000);

        }
    });
    
}