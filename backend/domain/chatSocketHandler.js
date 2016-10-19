var config = require('../config.json')
    , redis = require('redis')
    , storage = redis.createClient(config.redis.port, config.redis.host)
    , sub = redis.createClient(config.redis.port, config.redis.host)
	, pub = redis.createClient(config.redis.port, config.redis.host)
    , utils = require('../helpers/utils')
    , Chat = require('../models/chat')
    , repo = require('./chatSocketHandlerRepository');

storage.on('connect', function() {
    if(process.env.NODE_ENV === 'dev') {
        storage.del('chat.onlineList');
    }

    storage.del('subscribers');  

    console.log('Redis clients connected on HOST ' + config.redis.host + ':' + config.redis.port);
});

//It's limited to ten listeners. Zero means infinity
sub.setMaxListeners(0);

var _init = function(chatNamespace) {
    sub.on('message', function(channel, message) {
        switch(channel) {
            case 'chat:position:update':
                var data = JSON.parse(message);

                chatNamespace.emit('chat:position:update', {
                    id: data.id,
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    coords: {
                        latitude: data.latitude,
                        longitude: data.longitude
                    }
                });
            break;
            case 'chat:signout':
                chatNamespace.emit('chat:signout', JSON.parse(message));
            break;
            case 'chat:message':
                var parsedMessage = JSON.parse(message);

                parsedMessage.chat.members.forEach(function(member) {
                    for (var property in chatNamespace.connected) {
                        if (chatNamespace.connected.hasOwnProperty(property)) {
                            
                            if(chatNamespace.connected[property].user.id === member.id) {
                                chatNamespace.connected[property].emit('chat:room', parsedMessage);
                                break;
                            }
                        }
                    }
                });

            break;
        }

    });

}

//Global list of channels subscriptions (It should subscribes only once)
var subs = [];

//handler
var _handler = function(socket) {
    if(subs.indexOf('chat:position:update') === -1) {
        subs.push('chat:position:update');
        sub.subscribe('chat:position:update');
    }

    if(subs.indexOf('chat:signout') === -1) {
        subs.push('chat:signout');
        sub.subscribe('chat:signout');
    }

    if(subs.indexOf('chat:invitation') === -1) {
        subs.push('chat:invitation');
        sub.subscribe('chat:invitation');
    }

    if(subs.indexOf('chat:message') === -1) {
        subs.push('chat:message');
        sub.subscribe('chat:message');
    }

    //receptors
    socket.on('chat:position:update', function(data) {
        // Add or update the user in the online list
        storage.hmset('chat.onlineList'
            , socket.user.email
            , JSON.stringify({
                id: socket.user.id,
                firstName: socket.user.firstName,
                lastName: socket.user.lastName,
                coords: {
                    latitude: data.latitude,
                    longitude: data.longitude
                }
            })
        );

        data.id = socket.user.id;
        data.email = socket.user.email;
        data.firstName = socket.user.firstName;
        data.lastName = socket.user.lastName;

        pub.publish('chat:position:update', JSON.stringify(data));
    });

    socket.on('chat:message:send', function(message) {
        message.from = socket.user.id;

        repo.addMessageAndReturnService(message).then(function(message) {
            pub.publish('chat:message', JSON.stringify(message));

        }, function(err) { throw new Error(err); });
        
    });

    // Creates a chat room and invites the target user
    socket.on('chat:new', function(invitedUsers) {
        if(!Array.isArray(invitedUsers))
            throw new Error('invitedUsers variable in chat:new event is not an array.');

        var invitedUsersIds = [socket.user.id];

        invitedUsers.forEach(function(invitedUser) {
            invitedUsersIds.push(invitedUser.id);
        });

        // Get an existing chat or create a new one, then gets the full user objects
        repo.getChatAndMembersAndMessagesService(invitedUsersIds).then(function(chat) {
            socket.emit('chat:new', chat);
        });

    });

    // Get online users
    socket.on('chat:online:list', function(data) {
        storage.hgetall('chat.onlineList', function(err, onlineList) { 
            if(onlineList === null)
                onlineList = {};

            var result = [];
            var keys = Object.keys(onlineList);

            for(var i = 0; i < keys.length; i++) {
                var userInfoParse = JSON.parse(onlineList[keys[i]]);

                result.push({
                    id: userInfoParse.id,
                    email: keys[i],
                    firstName: userInfoParse.firstName,
                    lastName: userInfoParse.lastName,
                    coords: {
                        latitude: userInfoParse.coords.latitude,
                        longitude: userInfoParse.coords.longitude
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
            id: socket.user.id
        }));
    });

    socket.emit('chat:ready', {});
}

exports.handler = _handler;
exports.init = _init;