/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	login: function (req, res) {
		User.attemptLogin({
			username: req.param('username'),
			password: req.param('password')
		}, function (loggedIn, user) {
			if (!loggedIn) {
				if (req.wantsJSON) {
					return res.badRequest('Invalid username/password combination.');
				}
				return res.send('Invalid username/password');
			}
			req.session.me = user.id;
			if (req.wantsJSON) {
				return res.ok();
			}
			return res.redirect('/');
		})
	},
	logout: function (req, res) {
		req.session.me = null;
		if (req.wantsJSON) {
			return res.ok('Logged out successfully!');
		}
		return res.redirect('/');
	},
	signup: function (req, res) {
		User.signup({
			username: req.param('username'),
			password: req.param('password')
		}, function (err, userDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}

			req.session.me = userDB.id;
			if (req.wantsJSON) {
				return res.ok('Signup successful!');
			}

			return res.redirect('/');
		});
	}

};

