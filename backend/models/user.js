var mongoose = require('mongoose')
	, bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		default: '/dist/images/profile-default.jpeg'
	},
});

userSchema.pre('save', function(next) {
  var user = this;

  if(!user.isModified('password'))
    return next();

  bcrypt.genSalt(10, function(err, salt) {
    if(err)
      return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if(err)
        return next(err);

      user.password = hash;

    	return next();
    });
  });
});

var User = mongoose.model('User', userSchema);

module.exports = User;