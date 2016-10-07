var express = require('express')
  , router = express.Router()
  , AccessToken = require('../models/accessToken')
  , crypto = require('crypto')
  , RefreshToken = require('../models/refreshToken')
  , mongoose = require('mongoose');

router.post('/revoke', function(req, res) {
    req.checkBody('token', 'Invalid refresh token.').notEmpty();

    var errors = req.validationErrors();

    if(errors) {
      return res.status(400).json(errors);
    }

    var refreshTokenHash = crypto.createHash('sha1').update(req.body.token).digest('hex');
    
    RefreshToken.findOne({ token: refreshTokenHash }, function(err , refreshToken) {
        if(err) {
            return res.status(500).json({
                status: 'ERROR',
                message: 'Internal server error.'
            });
        }

        if(!refreshToken) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid refresh token.'
            });
        }

        RefreshToken.findOneAndRemove({ token: refreshToken.token }, function(err) {
            if(err) {
                return res.status(500).json({
                    status: 'ERROR',
                    message: 'Internal server error.'
                });
            }

            AccessToken.findOneAndRemove({ userEmail: refreshToken.userEmail }, function(err) {
                if(err) {
                    return res.status(500).json({
                        status: 'ERROR',
                        message: 'Internal server error.'
                    });
                }

                res.status(200).json({
                    status: 'OK',
                    message: 'Refresh and access tokens revoked successfully.'
                });
            });
        });

    });

});

module.exports = router;