/**
 * ProdutoController
 *
 * @description :: Server-side logic for managing Produtoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	findByCodigo: function (req, res) {
		let codigoDesc = req.body.codigo;
		Produto.findOne({codigo: codigoDesc}).populate(['precos', 'estoques']).exec(function (err, produto) {
			if (!err && produto) {
				return res.send({ produto: produto });
			}
			else {
				if (err) {
					console.log(JSON.stringify(err));
				}
				Produto.find({descricao: {contains: codigoDesc}}).populate(['precos', 'estoques']).exec(function (err, produtos) {
					if (err) {
						console.log(JSON.stringify(err));
						return res.send(JSON.stringify(err));
					}
					return res.send({ produtos: produtos });
				})
			}
		});
	},
	import: function (req, res) {
		req.body.produtos.forEach(function (produto, index) {
			let prod = {
				descricao: produto.descricao,
				categoria: produto.categoria,
				quantidade: 0,
				custo: 0
			};
			Produto.create(prod).exec(function (err, prodDB) {
				if (err) {
					console.log(JSON.stringify(err));
					return res.send(JSON.stringify(err));
				}
				console.log(JSON.stringify(prodDB));
				Preco.create({
					produto: prodDB.id,
					tabelaPreco: '59e76d14ed28230400ba32b2',
					valor: produto.preco
				}).exec(function (err, preco) {
					if (err) {
						console.log(JSON.stringify(err));
					}
				});
				Preco.create({
					produto: prodDB.id,
					tabelaPreco: '59ee024af1b60d60281297a1',
					valor: produto.preco2
				}).exec(function (err, preco) {
					if (err) {
						console.log(JSON.stringify(err));
					}
				});
			});
		});

		return res.send("OK");
	},
	index: function (req, res) {
		Produto.find().populate(['categoria', 'estoques']).exec(function (err, produtos) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			let viewConfig = {

			};
			PermissaoService.hasEditDeletePermissao({
				userId: req.session.me,
				insertPath: '/produto/create',
				deletePath: '/produto/delete',
				editPath: '/produto/edit'
			}, function (resultPermissao) {
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
							titulo: 'Quantidade Total',
							nome: 'quantidadeTotal',
							isFunction: true
						}
					],
					records: produtos,
					options: {
						insert: 'Novo Produto',
						insertURL: '/produto/create',
						updateURL: '/produto/edit',
						deleteURL: '/produto/delete',
						searchField: {
							descricao: 'Descrição',
							type: 'text',
							nome: 'descricao'
						},
						permissoes: resultPermissao
					},
					filtro: true
				});
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
		Produto.find({id: req.param('id')}).populate(['categoria', 'precos', 'estoques', 'fornecedor']).exec(function (err, produto) {
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

				Estoque.find().exec(function (err, estoques) {
					if (err) {
						console.log(JSON.stringify(err));
						return res.send(JSON.stringify(err));
					}
					return res.view({produto: produto, tabelasPreco: tabelas, estoques: estoques});
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
			Estoque.find().exec(function (err, estoques) {
				if (err) {
					console.log(JSON.stringify(err));
					return res.send(JSON.stringify(err));
				}
				return res.view({tabelasPreco: tabelasPreco, estoques: estoques});
			});
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