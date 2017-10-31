

module.exports = {
	hasPermissao: function (options, done) {
		User.findOne({id: options.userId}).exec(function (err, user) {
			if (err) {
				console.log(JSON.stringify(err));
				return done(false);
			}

			GrupoPermissao.findOne({id: user.grupopermissao}).exec(function (err, grupo) {
				if (err) {
					console.log(JSON.stringify(err));
					return done(false);
				}
				if (typeof grupo.permissoes == 'undefined' || grupo.permissoes.length == 0) {
					return done(false);
				}

				console.log(options.path);
				let permissao = grupo.permissoes.find(function (element) {
					return element.path == options.path;
				});

				if (typeof permissao == 'undefined') {
					return done(false);
				}
				return done(true);
			});
		});			
	},
	getGruposPermissao: function (done) {
		GrupoPermissao.find().exec(function (err, grupos) {
			if (err) {
				console.log(JSON.stringify(err));
				return done([]);
			}
			return done(grupos);
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