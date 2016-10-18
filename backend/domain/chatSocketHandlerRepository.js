var Q = require('q')
    , Chat = require('../models/chat')
    , Message = require('../models/message')
    , User = require('../models/user')
    , helper = require('../helpers/utils')
    , mongoose = require('mongoose');

var _createChatAndReturn = function(members) {
    var deferred = Q.defer();

    new Chat({
        members: members
    }).save(function(err) {
        if(err)
            deferred.reject(err);
        
        _findChatByUsers(members).then(function(chat) {
            deferred.resolve(chat);

        }, function(err) {
            deferred.reject(err);

        });
        
    });

    return deferred.promise
}

var _findChatByUsers = function(members) {
    var deferred = Q.defer();

    Chat.findOne(
        { $and: [{ members: { $all: members } }, { members: { $size: members.length } }] }
        , '-__v'
        , function(err, chat) {
            if(err)
                deferred.reject(err);

            deferred.resolve(chat);
        }
    );

    return deferred.promise;
}

var _getUsersByIds = function(ids) {
    var deferred = Q.defer();

    var mongoIds = [];

    ids.forEach(function(id) {
        mongoIds.push(new mongoose.Types.ObjectId(id));
    });

    User.find({ _id: { $in: mongoIds }}
    , '-__v'
    , function(err, users) {
        if(err)
            deferred.reject(err);

        deferred.resolve(users);
    });

    return deferred.promise;
}

var _getMessagesByChatId = function(chatId) {
    var deferred = Q.defer();

    Message.find({ chatId: chatId }, '-__v').sort({ timestamp: 'desc' }).limit(15).exec(function(err, messages) {
        if(err)
            deferred.reject(err);
        
        // The older messages should be in the initial array positions, like a push natural behavior.
        messages.reverse();

        deferred.resolve(messages);
    });

    return deferred.promise;
}

var _getChatOrCreateAndReturn = function(members) {
    var deferred = Q.defer();

    _findChatByUsers(members).then(function(chat) {
        if(!chat) {
            _createChatAndReturn(members).then(function(chat) {
                deferred.resolve(chat);

            }, function(err) { deferred.reject(err); });

        } else {
            deferred.resolve(chat);
        }

    }, function(err) { deferred.reject(err); });

    return deferred.promise;
}

var _addMessageAndReturn = function(message) {
    var deferred = Q.defer();

    var timestamp = helper.getUTCTimestamp();

    new Message({
        chatId: message.chatId,
        from: message.from,
        timestamp: timestamp,
        text: message.text
    }).save(function(err) {
        if(err)
            deferred.reject(err);

        Message.findOne(
            { $and: [{ timestamp: timestamp }, { chatId: message.chatId }] }
            , '-__v',
            function(err, message) {
                if(err)
                    deferred.reject(err);
                
                deferred.resolve(message);
            });

        

    });

    return deferred.promise;
}

var _getChatById = function(id) {
    var deferred = Q.defer();

    Chat.findOne({ _id: new mongoose.Types.ObjectId(id) }, '-__v', function(err, chat) {
        if(err)
            deferred.reject(err);

        deferred.resolve(chat);
    });

    return deferred.promise;
}

//services (services are everything that handles data to something. Eg. multiple db calls, obj structure changes and so on.
var _getChatAndMembersAndMessagesService = function(members) {
    var deferred = Q.defer();

    _getChatOrCreateAndReturn(members).then(function(chat) {
        _getMessagesByChatId(chat._id).then(function(messages) {
            _getUsersByIds(members).then(function(users) {
                var handledUsers = [];

                users.forEach(function(user) {
                    handledUsers.push({
                        id: user._id.toString(),
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName
                    });
                });

                deferred.resolve({
                    roomId: chat._id.toString(),
                    members: handledUsers,
                    messages: messages
                });

            }, function(err) { return deferred.reject(err); });
        }, function(err) { return deferred.reject(err); });
    }, function(err) { return deferred.reject(err); });

    return deferred.promise;
}

var _addMessageAndReturnService = function(message) {
    var deferred = Q.defer();

    message.chatId = message.roomId;

    _addMessageAndReturn(message).then(function(message){
        deferred.resolve({
            id: message._id.toString(),
            roomId: message.chatId,
            from: message.from,
            timestamp: message.timestamp,
            text: message.text
        });

    }, function(err){ deferred.reject(err); });

    return deferred.promise;
}

exports.createChatAndReturn = _createChatAndReturn;
exports.findChatByUsers = _findChatByUsers;
exports.getUsersByIds = _getUsersByIds;
exports.getMessagesByChatId = _getMessagesByChatId;
exports.getChatOrCreateAndReturn = _getChatOrCreateAndReturn;
exports.addMessageAndReturn = _addMessageAndReturn;
exports.getChatById = _getChatById;

exports.getChatAndMembersAndMessagesService = _getChatAndMembersAndMessagesService;
exports.addMessageAndReturnService = _addMessageAndReturnService;
