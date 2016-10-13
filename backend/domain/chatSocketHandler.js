var config = require('../config.json')
    , auth = require('socketio-auth')
    , crypto = require('crypto')
    , redis = require('redis')
    , sub = redis.createClient(config.redis.port, config.redis.host)
	, pub = redis.createClient(config.redis.port, config.redis.host)
    , storage = redis.createClient(config.redis.port, config.redis.host)
    , utils = require("../helpers/utils")
    , User = require('../models/user')
    , AccessToken = require('../models/accessToken');

module.exports = function(io) {
    sub.setMaxListeners(0);

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

                User.findOne({ email: accessToken.userEmail }, function (err, user) {
                    if (err)
                        return callback(new Error("Internal server error."));

                    if (!user)
                        return callback(new Error("User not found."));

                    socket.user = {
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName
                    }

                    if(!data.coords)
                        return callback(new Error("Invalid coordinates."));

                    socket.coords = data.coords;

                    return callback(null, true);
                });
            });
            
        },
        postAuthenticate: function(socket, data) {
            // Stores the new user
            storage.hmset('chat.onlineUsers'
                , socket.user.email
                , JSON.stringify({ coords: socket.coords })
            );

            // When user sign in
            sub.on("message", function(channel, user) {
                if(channel === 'chat.user.signin') {
                    var parsedUser = JSON.parse(user);

                    if(socket.user.email !== parsedUser.email)
                        socket.emit('chat:user:signin', parsedUser);
                }
            });

            sub.subscribe("chat.user.signin");

            pub.publish('chat.user.signin', JSON.stringify({
                email: socket.user.email,
                coords: socket.coords
            }));

            // When user sign out
            sub.on("message", function(channel, user) {
                if(channel === 'chat.user.signout') {
                    var parsedUser = JSON.parse(user);

                    if(socket.user.email !== parsedUser.email)
                        socket.broadcast.emit('chat:user:signout', parsedUser);
                }
            });

            sub.subscribe("chat.user.signout");

            // Get online users
            socket.on('chat:onlineUsers:get', function(data) {
                storage.hgetall('chat.onlineUsers', function(err, onlineUsers) { 
                    if(onlineUsers === null)
                        onlineUsers = {};

                    var result = [];
                    var keys = Object.keys(onlineUsers);

                    for(var i = 0; i < keys.length; i++) {
                        var location = JSON.parse(onlineUsers[keys[i]]);

                        result.push({
                            email: keys[i],
                            coords: {
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude
                            }
                        });
                        
                    }

                    socket.emit('chat:onlineUsers', result);
                });
            });

            // When invite someone to chat
            sub.subscribe('chat.invitation');

            sub.on("message", function(channel, invitation) {
                if(channel === 'chat.invitation') {
                    socket.broadcast.emit('chat:invitation', invitation);
                }
            });
            
            // When open a new chat window
            socket.on('chat:new', function(invitedUser) {
                var roomUid = utils.uid(32);

                sub.subscribe('chat.room.' + roomUid);

                sub.on("message", function(channel, message) {
                    if(channel === ('chat.room.' + roomUid)) {
                        socket.emit('chat:message:recieve', message);
                    }
                });

                socket.emit('chat:new:uid', {
                    roomUid: roomUid
                });

                pub.publish('chat.invitation', JSON.stringify({
                    from: socket.user.email,
                    to: invitedUser.email,
                    roomUid: roomUid
                }));

            });

            socket.on('message:send', function(message) {
                pub.publish('chat.room.' + message.roomUid, message.text);

            });

            // When sign out of chat
            socket.on('disconnect', function() {
                storage.del('chat.onlineUsers', socket.user.email);
                
                pub.publish('chat.user.signout', JSON.stringify({
                    email: socket.user.email,
                    coords: socket.coords
                }));
            });

            socket.emit('ready');

        }
    });
    
}