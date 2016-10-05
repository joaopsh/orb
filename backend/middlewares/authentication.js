var passport = require('passport')
    , BasicStrategy = require('passport-http').BasicStrategy
    , ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy
    , BearerStrategy = require('passport-http-bearer').Strategy
    , User = require('../models/user')
    , Client = require('../models/client')
    , AccessToken = require('../models/accessToken')
    , crypto = require('crypto')
    , allowedOrigins = require('../config.json').origins;

var isStrategiesConfigured = false;

passport.use("clientBasic", new BasicStrategy(
    function (clientId, clientSecret, done) {
        clientSecret = crypto.createHash('sha1').update(clientSecret).digest('hex')
        
        Client.findOne({ clientId: clientId }, function (err, client) {
            if (err)
                return done(err, false);

            if (!client)
                return done(null, false);

            if (!client.isTrusted)
                return done(null, false);
            
            if (client.clientSecret === clientSecret)
                return done(null, client);
            else
                return done(null, false);
        });
    }
));

passport.use("clientPassword", new ClientPasswordStrategy(
    function (clientId, clientSecret, done) {
        clientSecret = crypto.createHash('sha1').update(clientSecret).digest('hex');

        Client.findOne({ clientId: clientId }, function (err, client) {
            if (err) 
                return done(err, false);

            if (!client)
                return done(null, false);

            if (!client.isTrusted)
                return done(null, false);
            
            if (client.clientSecret == clientSecret)
                return done(null, client);
            else
                return done(null, false);
        });
    }
));

passport.use("accessToken", new BearerStrategy(
    function (accessToken, done) {

        var accessTokenHash = crypto.createHash('sha1').update(accessToken).digest('hex')
        
        AccessToken.findOne({ token: accessTokenHash }, function (err, token) {
            if (err) return done(err);

            if (!token) return done(null, false)

            if (new Date() > token.expirationDate) {
                done(null, false);

            } else {
                User.findOne({username: token.userId}, function (err, user) {
                    if (err)
                        return done(err);

                    if (!user)
                        return done(null, false);

                    Client.findOne({ clientId: token.clientId }, function(err, client) {
                        if(err)
                            return done(null, false);

                        if(!client)
                            return done(null, false);

                        return done(null, user, { scope: '*' });
                    });
                });
            }
        });
    }
));