var express = require('express')
  , router = express.Router()
  , Client = require('../models/client')
  , utils = require("../helpers/utils")
  , crypto = require('crypto')
  , mongoose = require('mongoose');

router.get('/', function(req, res) {
  Client.find({}, '-__v', function(err, clients) {

    var results = clients.map(function(client) {
      return {
        id: client.id,
        name: client.name,
        clientId: client.clientId,
        isTrusted: client.isTrusted,
      };

    });

    return res.json({
      status: 'OK',
      clients: results
    });
  });

});

router.post('/', function(req, res) {
    Client.findOne({ name: req.body.client.name }, function(err, foundClient) {
      if(err) {
        res.statusCode = 500;
        return res.json({ status: 'ERROR', message: 'Internal Server Error.'});
      }

      if(foundClient) {
        res.statusCode = 400;
        res.json({ status: 'ERROR', message: 'Client name already in use.' });

      } else {

        var client = new Client();

        var clientSecret = utils.uid(32);

        client.name = req.body.client.name;
        client.clientId = utils.uid(16);
        client.clientSecret = crypto.createHash('sha1').update(clientSecret).digest('hex');
        client.isTrusted = req.body.client.isTrusted;
        client.allowedOrigin = req.body.client.allowedOrigin;

        client.save(function(err) {
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
              client: {
                id: client._id,
                name: client.name,
                clientId: client.clientId,
                clientSecret: clientSecret,
                isTrusted: client.isTrusted,
              }
            });
          }
        });
      }
    });
});

 module.exports = router;