var Q = require('q')
    , Chat = require('../models/chat')
    , Message = require('../models/message')
    , User = require('../models/user')
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
        { $and: [{ members: { $all: members } }, { members: { $size: members.length } }] },
        function(err, chat) {
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

    User.find({ _id: { $in: mongoIds }}, function(err, users) {
        if(err)
            deferred.reject(err);

        deferred.resolve(users);
    });

    return deferred.promise;
}

var _getMessagesByChatId = function(chatId) {
    var deferred = Q.defer();

    Message.find({ chatId: chatId }, '-_id -__v', function(err, messages) {
        if(err)
            deferred.reject(err);

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

exports.createChatAndReturn = _createChatAndReturn;
exports.findChatByUsers = _findChatByUsers;
exports.getUsersByIds = _getUsersByIds;
exports.getMessagesByChatId = _getMessagesByChatId;
exports.getChatOrCreateAndReturn = _getChatOrCreateAndReturn;
exports.getChatAndMembersAndMessagesService = _getChatAndMembersAndMessagesService;