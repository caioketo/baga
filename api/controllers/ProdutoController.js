/**
 * ProdutoController
 *
 * @description :: Server-side logic for managing Produtoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function (req, res) {
		Produto.find().exec(function (err, produtos) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			//return res.view({produtos: produtos});
			return res.view('crud.ejs', {
				fields: [
					{
						titulo: 'Código',
						nome: 'codigo'
					},
					{
						titulo: 'Descrição',
						nome: 'descricao'
					},
					{
						titulo: 'Quantidade',
						nome: 'quantidade'
					}
				],
				records: produtos,
				options: {
					insert: 'Novo Produto',
					insertURL: '/produto/create',
					updateURL: '/produto/edit',
					deleteURL: '/produto/delete'
				}
			});
		});
	},
	delete: function (req, res) {
		Produto.destroy({id: req.body.id}).exec(function (err) {
			console.log(JSON.stringify(err));
			return res.send({statusCode: 200});
		});
	},
	edit: function(req, res) {
		Categoria.find().exec(function (err, categorias) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			Produto.find({id: req.param('id')}).populate('precos').populate('categoria').exec(function (err, produto) {
				if (err) {
					console.log(JSON.stringify(err));
					return res.send(JSON.stringify(err));
				}
				produto = produto[0];
				TabelaPreco.find().exec(function (err, tabelas) {
					if (err) {
						console.log(JSON.stringify(err));
						return res.send(JSON.stringify(err));
					}
					for (var i = produto.precos.length - 1; i >= 0; i--) {
						for (var l = tabelas.length - 1; l >= 0; l--) {
							if (produto.precos[i].tabelaPreco == tabelas[l].id) {
								produto.precos[i].tabelaNome = tabelas[l].descricao;
							}
						}
					}

					return res.view({produto: produto, tabelasPreco: tabelas, categorias: categorias});
				});
			});
		});
		
	},
	create: function (req, res) {
		TabelaPreco.find().exec(function (err, tabelasPreco) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.view({tabelasPreco: tabelasPreco});
		});
	},
	editPost: function (req, res) {
		Produto.update({id: req.body.id}, req.body.produto).exec(function (err, produtoDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}

			return res.send({statusCode: 200, produto: produtoDB});
		});
	},
	createPost: function (req, res) {
		//validate(req.body, function (produto) {
		Produto.create(req.body.produto).exec(function (err, produtoDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}

			return res.send({statusCode: 200, produto: produtoDB});
		});
	}
};