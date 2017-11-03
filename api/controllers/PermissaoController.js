/**
 * PermissaoController
 *
 * @description :: Server-side logic for managing Permissaos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function (req, res) {
		Permissao.find().exec(function (err, permissoes) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			PermissaoService.hasEditDeletePermissao({
				userId: req.session.me,
				insertPath: '/permissao/create',
				deletePath: '/permissao/delete',
				editPath: '/permissao/edit'
			}, function (resultPermissao) {
				return res.view('crud.ejs', {
					fields: [
						{
							titulo: 'Nome',
							nome: 'nome'
						},
						{
							titulo: 'Path',
							nome: 'path'
						}
					],
					records: permissoes,
					options: {
						insert: 'Nova Permissão',
						insertURL: '/permissao/create',
						updateURL: '/permissao/edit',
						deleteURL: '/permissao/delete',
						searchField: {
							descricao: 'Nome',
							type: 'text',
							nome: 'nome'
						},
						permissoes: resultPermissao
					}
				});
			});
		});
	},
	create: function (req, res) {
		return res.view();
	},
	edit: function (req, res) {
		Permissao.findOne({id: req.param('id')}).exec(function (err, permissao) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.view({permissao: permissao});
		});
	},
	editPost: function (req, res) {
		Permissao.update({id: req.body.id}, req.body.permissao).exec(function (err, permissaoDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200, permissao: permissaoDB});
		});
	},
	createPost: function (req, res) {
		//validate(req.body, function (produto) {
		Permissao.create(req.body.permissao).exec(function (err, permissaoDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}

			return res.send({statusCode: 200, permissao: permissaoDB});
		});
	},
	delete: function (req, res) {
		Permissao.destroy({id: req.body.id}).exec(function (err) {
			if (err) {
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200});
		});
	},
	deleteAll: function (req, res) {
		Permissao.destroy({}, function (err) {
			return res.send('/dashboard');
		});
	},
	createDefaults: function (req, res) {
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
		return res.redirect('/dashboard');
	}
};

