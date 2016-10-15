var express = require('express')
  , router = express.Router()
  , crypto = require('crypto')
  , User = require('../models/user')
  , AccessToken = require('../models/accessToken')
  , mongoose = require('mongoose');

router.get('/', function(req, res) {
	User.find({}, '-password -__v', function(err, users) {

    var results = users.map(function(user) {
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      };

    });

		return res.json({
      status: 'OK',
      users: results
    });
	});

});

router.get('/:id', function(req, res) {
  User.findOne({ _id: req.params.id }, '-password -__v', function(err, user) {
    if(err)
        return res.status(500).json({ status: 'ERROR', message: 'Internal Server Error.'});

    if(user) {
      return res.json({
        status: 'OK',
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      });

    } else {
      res.status(400).json({ status: 'ERROR', message: 'User does not exist.' });
    }

  });

});

router.get('/accesstoken/:accessToken', function(req, res) {
  if(!req.params.accessToken)
    return res.status(400).json({ status: 'ERROR', message: 'Missing access token parameter.'});
  
  var accessTokenHash = crypto.createHash('sha1').update(req.params.accessToken).digest('hex');

  AccessToken.findOne({ token: accessTokenHash }, function(err, accessToken) {
    if(err)
        return res.status(500).json({ status: 'ERROR', message: 'Internal Server Error.'});

    if(!accessToken)
        return res.status(400).json({ status: 'ERROR', message: 'Invalid access token.'});

    User.findOne({ email: accessToken.userEmail }, '-password -__v', function(err, user) {
      if(err)
          return res.status(500).json({ status: 'ERROR', message: 'Internal Server Error.'});

      if(user) {
        return res.status(200).json({
          status: 'OK',
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          }
        });

      } else {
        return res.status(400).json({ status: 'ERROR', message: 'User does not exist.' });
      }

    });

  });

});

router.post('/', function(req, res) {
    req.checkBody('user.firstName', 'First name is required.').notEmpty();
    req.checkBody('user.lastName', 'Last name is required.').notEmpty();
    req.checkBody('user.email', 'E-mail is required.').notEmpty();
    req.checkBody('user.password', 'Password is required.').notEmpty();

    var errors = req.validationErrors();

    if(errors)
      return res.status(400).json(errors);
    
    User.findOne({ email: req.body.user.email }, function(err, foundUser) {
      if(err) {
        return res.status(500).json({ status: 'ERROR', message: 'Internal Server Error.'});
      }

      if(foundUser) {
        res.status(400).json({ status: 'ERROR', message: 'User already exists.' });

      } else {

        var user = new User();

        user.firstName = req.body.user.firstName;
        user.lastName = req.body.user.lastName;
        user.email = req.body.user.email;
        user.password = req.body.user.password;

        user.save(function(err) {
          if(err) {
            if(err.name == 'ValidationError')
              return res.status(400).json({ status: 'ERROR', message: 'Validation Error.'});
            
            return res.status(500).json({ status: 'ERROR', message: 'Internal Server Error.'});
          }
          else {
            return res.status(200).json({ 
                status: 'OK', 
                user: {
                  id: user._id,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email
                }
            });

          }

        });

      }

    });
});

module.exports = router;