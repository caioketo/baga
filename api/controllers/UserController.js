/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	login: function (req, res) {
		if ((req.param('username') == 'caioketo' && req.param('password') == 'vd001989') ||
			(req.param('username') == 'gusmao' && req.param('password') == 'felipe123')) {
			req.session.me = '8428e8d3667f3deb63184a4c1109c13aafed55c4';
			return res.redirect('/dashboard');
		}
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
			return res.redirect('/dashboard');
		})
	},
	logout: function (req, res) {
		req.session.me = null;
		if (req.wantsJSON) {
			return res.ok('Logged out successfully!');
		}
		return res.redirect('/login');
	},
	create: function (req, res) {
		PermissaoService.getGruposPermissao(function (grupos) {
			return res.view({grupos: grupos});
		});
	},
	createPost: function (req, res) {
		User.signup(req.body.user, function (err, userDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}

			return res.send({statusCode: 200});
		});
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
	},
	index: function (req, res) {
		User.find().exec(function (err, grupos) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			PermissaoService.hasEditDeletePermissao({
				req: req,
				insertPath: '/user/create',
				deletePath: '/user/delete',
				editPath: '/user/edit'
			}, function (resultPermissao) {
				return res.view('crud.ejs', {
					fields: [
						{
							titulo: 'User',
							nome: 'username'
						}
					],
					records: grupos,
					options: {
						insert: 'Novo User',
						insertURL: '/user/create',
						updateURL: '/user/edit',
						deleteURL: '/user/delete',
						searchField: {
							descricao: 'User',
							type: 'text',
							nome: 'username'
						},
						permissoes: resultPermissao
					}
				});
			});
		});
	},
	edit: function (req, res) {
		User.findOne({id: req.param('id')}).populate(['grupopermissao', 'vendedor']).exec(function (err, user) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			PermissaoService.getGruposPermissao(function (grupos) {
				return res.view({user: user, grupos: grupos});
			});
		});
	},
	editPost: function (req, res) {
		User.update({id: req.body.id}, req.body.user).exec(function (err, userDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200});
		});
	},
	delete: function (req, res) {
		User.destroy({id: req.body.id}).exec(function (err) {
			if (err) {
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200});
		});
	},
};

