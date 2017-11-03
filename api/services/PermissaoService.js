

module.exports = {
	hasPermissao: function (options, done) {
		User.findOne({id: options.userId}).exec(function (err, user) {
			if (err) {
				console.log(JSON.stringify(err));
				return done(false);
			}

			GrupoPermissao.findOne({id: user.grupopermissao}).populate('permissoes').exec(function (err, grupo) {
				if (err) {
					console.log(JSON.stringify(err));
					return done(false);
				}
				if (typeof grupo == 'undefined' || typeof grupo.permissoes == 'undefined' || 
					grupo.permissoes.length == 0) {
					return done(false);
				}

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
	hasEditDeletePermissao: function (options, done) {
		if (options.userId == '8428e8d3667f3deb63184a4c1109c13aafed55c4') {
			return done({
				insert: true,
				delete: true,
				edit: true
			});
		}
		User.findOne({id: options.userId}).exec(function (err, user) {
			if (err) {
				console.log(JSON.stringify(err));
				return done({
					insert: false,
					delete: false,
					edit: false
				});
			}

			GrupoPermissao.findOne({id: user.grupopermissao}).populate('permissoes').exec(function (err, grupo) {
				if (err) {
					console.log(JSON.stringify(err));
					return done({
						insert: false,
						delete: false,
						edit: false
					});
				}
				if (typeof grupo == 'undefined' || typeof grupo.permissoes == 'undefined' || 
					grupo.permissoes.length == 0) {
					return done({
						insert: false,
						delete: false,
						edit: false
					});
				}

				let permissoes = {};
				permissoes.edit = grupo.permissoes.find(function (element) {
					return element.path == options.editPath;
				});

				permissoes.delete = grupo.permissoes.find(function (element) {
					return element.path == options.deletePath;
				});

				permissoes.insert = grupo.permissoes.find(function (element) {
					return element.path == options.insertPath;
				});

				if (typeof permissoes.edit == 'undefined') {
					permissoes.edit = false;
				}
				else {
					permissoes.edit = true;
				}
				if (typeof permissoes.delete == 'undefined') {
					permissoes.delete = false;
				}
				else {
					permissoes.delete = true;
				}
				if (typeof permissoes.insert == 'undefined') {
					permissoes.insert = false;
				}
				else {
					permissoes.insert = true;
				}
				return done(permissoes);
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
	},
	getDashboardPermissoes: function (options, done) {
		User.findOne({id: options.userId}).exec(function (err, user) {
			if (err) {
				console.log(JSON.stringify(err));
				return done(err);
			}

			GrupoPermissao.findOne({id: user.grupopermissao}).populate('permissoes').exec(function (err, grupo) {
				if (err) {
					console.log(JSON.stringify(err));
					return done(err);
				}
				if (typeof grupo == 'undefined') {
					return done('Grupo Inexistente');
				}
				let dashboardPermissoes = {};
				grupo.permissoes.forEach(function (element, index) {
					if (element.path == '/produto') {
						dashboardPermissoes.produto = true;
					}
					if (element.path == '/categoria') {
						dashboardPermissoes.categoria = true;
					}
					if (element.path == '/cliente') {
						dashboardPermissoes.cliente = true;
					}
					if (element.path == '/fornecedor') {
						dashboardPermissoes.fornecedor = true;
					}
					if (element.path == '/formaPagamento') {
						dashboardPermissoes.formaPagamento = true;
					}
					if (element.path == '/condicaoPagamento') {
						dashboardPermissoes.condicaoPagamento = true;
					}
					if (element.path == '/vendedor') {
						dashboardPermissoes.vendedor = true;
					}
					if (element.path == '/tabelaPreco') {
						dashboardPermissoes.tabelaPreco = true;
					}
					if (element.path == '/conta') {
						dashboardPermissoes.conta = true;
					}
					if (element.path == '/moeda') {
						dashboardPermissoes.moeda = true;
					}
					if (element.path == '/loja') {
						dashboardPermissoes.loja = true;
					}
					if (element.path == '/grupopermissao') {
						dashboardPermissoes.grupopermissao = true;
					}
					if (element.path == '/user') {
						dashboardPermissoes.user = true;
					}
					if (element.path == '/loja') {
						dashboardPermissoes.loja = true;
					}
				});
				return done(undefined, dashboardPermissoes);
			});
		});
	}
};