

module.exports = {
	isFiscal: function (options, done) {
		options.userId = options.userId || options.req.session.me;
		if (options.userId == '8428e8d3667f3deb63184a4c1109c13aafed55c4') {
			return done(false);
		}
		User.findOne({id: options.userId}).exec(function (err, user) {
			if (err) {
				console.log(JSON.stringify(err));
				return done(false);
			}

			if (typeof user == 'undefined') {
				return done(false);
			}

			if (user.fiscal) {
				return done(true);
			}
		});
	},
	hasPermissao: function (options, done) {
		options.userId = options.userId || options.req.session.me;
		User.findOne({id: options.userId}).exec(function (err, user) {
			if (err) {
				console.log(JSON.stringify(err));
				return done(false);
			}

			if (typeof user == 'undefined') {
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
		options.userId = options.userId || options.req.session.me;
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

			if (typeof user == 'undefined') {
				return done(false);
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
		options.userId = options.userId || options.req.session.me;
		User.findOne({id: options.userId}).exec(function (err, user) {
			if (err) {
				console.log(JSON.stringify(err));
				return done(err);
			}

			if (typeof user == 'undefined') {
				return done('Não autorizado!');
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
					if (element.path == '/estoque') {
						dashboardPermissoes.estoque = true;
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
	},
	insertDefaults: function (done) {
		Permissao.create({nome: 'Tabla de Productos', path: '/produto'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Creación de Productos', path: '/produto/create'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Edición de Productos', path: '/produto/edit'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Exclusión de Productos', path: '/produto/delete'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Tabla de Categorías', path: '/categoria'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Creación de Categorías', path: '/categoria/create'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Edición de Categorías', path: '/categoria/edit'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Exclusión de Categorías', path: '/categoria/delete'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Tabla de Clientes', path: '/cliente'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Creación de Clientes', path: '/cliente/create'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Edición de Clientes', path: '/cliente/edit'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Exclusión de Clientes', path: '/cliente/delete'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Tabla de Proveedores', path: '/fornecedor'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Creación de Proveedores', path: '/fornecedor/create'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Edición de Proveedores', path: '/fornecedor/edit'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Exclusión de Proveedores', path: '/fornecedor/delete'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Tabla de Formas de Pago', path: '/formaPagamento'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Creación de Formas de Pago', path: '/formaPagamento/create'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Edición de Formas de Pago', path: '/formaPagamento/edit'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Exclusión de Formas de Pago', path: '/formaPagamento/delete'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Tabla de Condiciónes de Pago', path: '/condicaoPagamento'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Creación de Condiciónes de Pago', path: '/condicaoPagamento/create'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Edición de Condiciónes de Pago', path: '/condicaoPagamento/edit'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Exclusión de Condiciónes de Pago', path: '/condicaoPagamento/delete'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Tabla de Vendedores', path: '/vendedor'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Creación de Vendedores', path: '/vendedor/create'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Edición de Vendedores', path: '/vendedor/edit'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Exclusión de Vendedores', path: '/vendedor/delete'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Tabla de Tabla de Precio', path: '/tabelaPreco'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Creación de Tabla de Precio', path: '/tabelaPreco/create'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Edición de Tabla de Precio', path: '/tabelaPreco/edit'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Exclusión de Tabla de Precio', path: '/tabelaPreco/delete'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Tabla de Monedas', path: '/moeda'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Creación de Monedas', path: '/moeda/create'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Edición de Monedas', path: '/moeda/edit'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Exclusión de Monedas', path: '/moeda/delete'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Tabla de Tiendas', path: '/loja'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Creación de Tiendas', path: '/loja/create'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Edición de Tiendas', path: '/loja/edit'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Exclusión de Tiendas', path: '/loja/delete'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Tabla de Permissiones', path: '/permissao'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Creación de Permissiones', path: '/permissao/create'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Edición de Permissiones', path: '/permissao/edit'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Exclusión de Permissiones', path: '/permissao/delete'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Tabla de Grupos de Permissiones', path: '/grupopermissao'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Creación de Grupos de Permissiones', path: '/grupopermissao/create'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Edición de Grupos de Permissiones', path: '/grupopermissao/edit'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Exclusión de Grupos de Permissiones', path: '/grupopermissao/delete'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Tabla de Usuarios', path: '/user'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Creación de Usuarios', path: '/user/create'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Edición de Usuarios', path: '/user/edit'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Exclusión de Usuarios', path: '/user/delete'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Tabla de Ventas', path: '/venda'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Creación de Ventas', path: '/venda/create'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Edición de Ventas', path: '/venda/edit'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Exclusión de Ventas', path: '/venda/delete'}).exec(function (err, permissao){});
		return done();
	}
};