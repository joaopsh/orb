
var oauth2orize = require('oauth2orize')
    , passport = require('passport')
    , crypto = require('crypto')
    , utils = require("../helpers/utils")
    , bcrypt = require('bcrypt')
    , User = require('../models/user')
    , AccessToken = require('../models/accessToken')
    , RefreshToken = require('../models/refreshToken');

// create OAuth 2.0 server
var server = oauth2orize.createServer();

//Resource owner password
server.exchange(oauth2orize.exchange.password(function (client, email, password, scope, done) {
    User.findOne({ email: email }, function (err, user) {
        if (err)
            return done(err);

        if (!user)
            return done(null, false);

        bcrypt.compare(password, user.password, function (err, res) {
            if (!res)
                return done(null, false);

            var newAccesstoken = utils.uid(256);
            var newRefreshToken = utils.uid(256);

            var newAccessTokenHash = crypto.createHash('sha1').update(newAccesstoken).digest('hex');
            var newRefreshTokenHash = crypto.createHash('sha1').update(newRefreshToken).digest('hex');
            
            // 5 minutes token
            var expirationDate = new Date(new Date().getTime() + (1000 * 60 * 120));
            
            var accessToken = new AccessToken();

            accessToken.token = newAccessTokenHash;
            accessToken.expirationDate = expirationDate;
            accessToken.clientId = client.clientId;
            accessToken.userEmail = email;

            AccessToken.remove({ clientId: client.clientId, userEmail: email }, function(err) {
                if(err)
                    return done(err);
            });

            accessToken.save(function (err) {
                if (err)
                    return done(err);

                var refreshToken = new RefreshToken();

                refreshToken.token = newRefreshTokenHash;
                refreshToken.clientId = client.clientId;
                refreshToken.userEmail = email;

                RefreshToken.remove({ clientId: client.clientId, userEmail: email }, function(err) {
                    if(err)
                        return done(err);
                });

                refreshToken.save(function(err) {
                    if (err)
                        return done(err);
                    
                    done(null, newAccesstoken, newRefreshToken, { expires_in: expirationDate });
                });
            });
        });
    });
}));

//Refresh Token
server.exchange(oauth2orize.exchange.refreshToken(function (client, refreshToken, scope, done) {
    var refreshTokenHash = crypto.createHash('sha1').update(refreshToken).digest('hex');

    RefreshToken.findOne({ token: refreshTokenHash }, function (err, foundRefreshToken) {
        if (err)
            return done(err);

        if (!foundRefreshToken)
            return done(null, false);
            
        if (client.clientId !== foundRefreshToken.clientId)
            return done(null, false);
        
        var newAccesstoken = utils.uid(256);
        var newRefreshToken = utils.uid(256);

        var newAccessTokenHash = crypto.createHash('sha1').update(newAccesstoken).digest('hex');
        var newRefreshTokenHash = crypto.createHash('sha1').update(newRefreshToken).digest('hex');
        
        // 5 minutes token
        var expirationDate = new Date(new Date().getTime() + (1000 * 60 * 120));
        
        var accessToken = new AccessToken();

        accessToken.token = newAccessTokenHash;
        accessToken.expirationDate = expirationDate;
        accessToken.clientId = client.clientId;
        accessToken.userEmail = foundRefreshToken.userEmail;

        AccessToken.remove({ clientId: client.clientId, userEmail: foundRefreshToken.userEmail }, function(err) {
            if(err)
                return done(err);
        });

        accessToken.save(function (err) {
            if (err)
                return done(err);

            var refreshToken = new RefreshToken();

            refreshToken.token = newRefreshTokenHash;
            refreshToken.clientId = client.clientId;
            refreshToken.userEmail = foundRefreshToken.userEmail;

            RefreshToken.remove({ clientId: client.clientId, userEmail: foundRefreshToken.userEmail }, function(err) {
                if(err)
                    return done(err);
            });

            refreshToken.save(function(err) {
                if (err)
                    return done(err);

                
                done(null, newAccesstoken, newRefreshToken, { expires_in: expirationDate });
            });
        });
    });
}));

// token endpoint
exports.token = [
    passport.authenticate(['clientBasic', 'clientPassword'], { session: false }),
    server.token(),
    server.errorHandler()
]
