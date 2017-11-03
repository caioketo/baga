/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcrypt = require('bcrypt');

module.exports = {

	attributes: {
		username: {
			type: 'string',
			required: true
		},
		password: {
			type: 'string',
			required: true
		},
		cliente: {
			model: 'Cliente'
		},
		vendedor: {
			model: 'vendedor'
		},
		grupopermissao: {
			model: 'grupopermissao'
		}
	},
	signup: function (inputs, cb) {
		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(inputs.password, salt, function (err, hash) {
				User.create({
			      username: inputs.username,
			      password: hash,
			      grupopermissao: inputs.grupopermissao
			    })
			    .exec(cb);
			});
		});
	},
	attemptLogin: function (inputs, cb) {
		User.findOne({username: inputs.username}).exec(function (err, user) {
			if (err || typeof user == 'undefined') {
				cb(false);
				return;
			}
			bcrypt.compare(inputs.password, user.password, function(err, res) {
				if (res) {
					cb(true, user);
				}
				else {
					cb(false);
				}
			});
		});
	}
};

