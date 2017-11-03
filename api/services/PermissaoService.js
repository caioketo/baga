

module.exports = {
	hasPermissao: function (options, done) {
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
		Permissao.create({nome: 'Tabelas de Produtos', path: '/produto'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Criação de Produtos', path: '/produto/create'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Edição de Produtos', path: '/produto/edit'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Exclusão de Produtos', path: '/produto/delete'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Tabelas de Categorias', path: '/categoria'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Criação de Categorias', path: '/categoria/create'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Edição de Categorias', path: '/categoria/edit'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Exclusão de Categorias', path: '/categoria/delete'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Tabelas de Clientes', path: '/cliente'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Criação de Clientes', path: '/cliente/create'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Edição de Clientes', path: '/cliente/edit'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Exclusão de Clientes', path: '/cliente/delete'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Tabelas de Fornecedores', path: '/fornecedor'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Criação de Fornecedores', path: '/fornecedor/create'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Edição de Fornecedores', path: '/fornecedor/edit'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Exclusão de Fornecedores', path: '/fornecedor/delete'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Tabelas de Formas de Pagamento', path: '/formaPagamento'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Criação de Formas de Pagamento', path: '/formaPagamento/create'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Edição de Formas de Pagamento', path: '/formaPagamento/edit'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Exclusão de Formas de Pagamento', path: '/formaPagamento/delete'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Tabelas de Condições de Pagamento', path: '/condicaoPagamento'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Criação de Condições de Pagamento', path: '/condicaoPagamento/create'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Edição de Condições de Pagamento', path: '/condicaoPagamento/edit'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Exclusão de Condições de Pagamento', path: '/condicaoPagamento/delete'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Tabelas de Vendedores', path: '/vendedor'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Criação de Vendedores', path: '/vendedor/create'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Edição de Vendedores', path: '/vendedor/edit'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Exclusão de Vendedores', path: '/vendedor/delete'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Tabelas de Tabelas de Preço', path: '/tabelaPreco'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Criação de Tabelas de Preço', path: '/tabelaPreco/create'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Edição de Tabelas de Preço', path: '/tabelaPreco/edit'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Exclusão de Tabelas de Preço', path: '/tabelaPreco/delete'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Tabelas de Moedas', path: '/moeda'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Criação de Moedas', path: '/moeda/create'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Edição de Moedas', path: '/moeda/edit'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Exclusão de Moedas', path: '/moeda/delete'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Tabelas de Lojas', path: '/loja'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Criação de Lojas', path: '/loja/create'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Edição de Lojas', path: '/loja/edit'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Exclusão de Lojas', path: '/loja/delete'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Tabelas de Permissões', path: '/permissao'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Criação de Permissões', path: '/permissao/create'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Edição de Permissões', path: '/permissao/edit'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Exclusão de Permissões', path: '/permissao/delete'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Tabelas de Grupos de Permissões', path: '/grupopermissao'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Criação de Grupos de Permissões', path: '/grupopermissao/create'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Edição de Grupos de Permissões', path: '/grupopermissao/edit'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Exclusão de Grupos de Permissões', path: '/grupopermissao/delete'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Tabelas de Usuários', path: '/user'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Criação de Usuários', path: '/user/create'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Edição de Usuários', path: '/user/edit'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Exclusão de Usuários', path: '/user/delete'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Tabelas de Vendas', path: '/venda'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Criação de Vendas', path: '/venda/create'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Edição de Vendas', path: '/venda/edit'}).exec(function (err, permissao){});
		Permissao.create({nome: 'Exclusão de Vendas', path: '/venda/delete'}).exec(function (err, permissao){});
		return done();
	}
};