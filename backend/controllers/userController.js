var express = require('express')
  , router = express.Router()
  , User = require('../models/user')
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
    if(err) {
        res.statusCode = 500;
        return res.json({ status: 'ERROR', message: 'Internal Server Error.'});
    }

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
      res.statusCode = 400;
      res.json({ status: 'ERROR', message: 'User does not exist.' });
    }

  });

});

router.post('/', function(req, res) {
    req.checkBody('user.firstName', 'Nome inválido.').notEmpty();
    req.checkBody('user.lastName', 'Sobrenome inválido.').notEmpty();
    req.checkBody('user.email', 'E-mail inválido.').notEmpty();
    req.checkBody('user.password', 'Senha inválida.').notEmpty();

    var errors = req.validationErrors();

    if(errors) {
      res.setHeader('Content-Type', 'application/json');
      return res.send(errors, 400);
    }

    User.findOne({ email: req.body.user.email }, function(err, foundUser) {
      if(err) {
        res.statusCode = 500;
        return res.json({ status: 'ERROR', message: 'Internal Server Error.'});
      }

      if(foundUser) {
        res.statusCode = 400;
        res.json({ status: 'ERROR', message: 'User already exists.' });

      } else {

        var user = new User();

        user.firstName = req.body.user.firstName;
        user.lastName = req.body.user.lastName;
        user.email = req.body.user.email;
        user.password = req.body.user.password;

        user.save(function(err) {
          if(err) {
            if(err.name == 'ValidationError') {
              res.statusCode = 400;
              return res.json({ status: 'ERROR', message: 'Validation Error.'});
            }

            res.statusCode = 500;
            return res.json({ status: 'ERROR', message: 'Internal Server Error.'});
          }
          else {
            res.statusCode = 200;
            return res.json({ 
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