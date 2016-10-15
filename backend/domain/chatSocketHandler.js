var config = require('../config.json')
    , redis = require('redis')
    , storage = redis.createClient(config.redis.port, config.redis.host)
    , sub = redis.createClient(config.redis.port, config.redis.host)
	, pub = redis.createClient(config.redis.port, config.redis.host)
    , utils = require("../helpers/utils")

storage.on('connect', function() {
    if(process.env.NODE_ENV === 'dev')
        storage.del('chat.onlineList');

    console.log('Redis clients connected on HOST ' + config.redis.host + ':' + config.redis.port);
});

//It's limited to ten listeners. Zero means infinity
sub.setMaxListeners(0);

var chatSocketHandler = function(chat, socket) {
    //subscribes
    sub.subscribe('chat:position:update');
    sub.subscribe('chat:invitation:' + socket.user.email);
    sub.subscribe('chat:signout');

    //receptors
    socket.on('chat:position:update', function(data) {
        // Add or update the user in the online list
        storage.hmset('chat.onlineList'
            , socket.user.email
            , JSON.stringify({
                coords: {
                    latitude: data.latitude,
                    longitude: data.longitude
                }
            })
        );

        data.email = socket.user.email;

        pub.publish('chat:position:update', JSON.stringify(data));
    });

    socket.on('chat:signout', function(data) {
        data.email = socket.user.email;
        pub.publish('chat:signout', JSON.stringify(data));
    });

    socket.on('chat:message', function(data) {
        data.from = socket.user.email;
        pub.publish('chat:room:' + data.roomId, JSON.stringify(data));
    });

    // Creates a chat room and invites the target user
    socket.on('chat:new', function(invitedUser) {
        var roomUid = utils.uid(32);

        sub.subscribe('chat:room:' + roomUid);

        sub.on("message", function(channel, message) {
            if(channel === ('chat:room:' + roomUid)) {
                socket.emit('chat:message', JSON.parse(message));
            }
        });

        socket.emit('chat:new', {
            roomUid: roomUid
        });

        pub.publish('chat:invitation:' + invitedUser.email, JSON.stringify({
            from: socket.user.email,
            to: invitedUser.email,
            roomUid: roomUid
        }));

    });

    //handlers
    sub.on('message', function(channel, message) {
        switch(channel) {
            case 'chat:position:update':
                var data = JSON.parse(message);

                socket.broadcast.emit('chat:position:update', {
                    email: data.email,
                    coords: {
                        latitude: data.latitude,
                        longitude: data.longitude
                    }
                });
            break;
            case 'chat:signout':
                socket.emit('chat:signout', JSON.parse(message));
            break;
            case 'chat:invitation' + socket.user.email:
                socket.emit('chat:invitation', JSON.parse(message));
            break;
        }
    });

    // Get online users
    socket.on('chat:online:list', function(data) {
        storage.hgetall('chat.onlineList', function(err, onlineList) { 
            if(onlineList === null)
                onlineList = {};

            var result = [];
            var keys = Object.keys(onlineList);

            for(var i = 0; i < keys.length; i++) {
                var location = JSON.parse(onlineList[keys[i]]);

                result.push({
                    email: keys[i],
                    coords: {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude
                    }
                });
                
            }

            socket.emit('chat:online:list', result);
        });
    });

    // When disconnect
    socket.on('disconnect', function() {
        storage.hdel('chat.onlineList', socket.user.email);
        
        pub.publish('chat:signout', JSON.stringify({
            email: socket.user.email
        }));
    });

    socket.emit('chat:ready', {});
}

module.exports = chatSocketHandler;