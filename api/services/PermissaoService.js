

module.exports = {
	hasPermissao: function (options, done) {
		User.findOne({id: options.userId}).populate('permissoes').exec(function (err, user) {
			if (err) {
				console.log(JSON.stringify(err));
				return done(false);
			}
			if (typeof user.permissoes == 'undefined' || user.permissoes.length == 0) {
				return done(false);
			}

			console.log(options.path);
			let permissao = user.permissoes.find(function (element) {
				return element.path == options.path;
			});

			if (typeof permissao == 'undefined') {
				return done(false);
			}
			return done(true);
		});
	},
	getListPermissoes: function (done) {
		Permissao.find().exec(function (err, permissoes) {
			if (err) {
				console.log(JSON.stringify(err));
				return done([]);
			}
			return done(permissoes);
		});
	}
};