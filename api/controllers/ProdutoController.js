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
		PermissaoService.isFiscal({req: req }, function (fiscal) {
			var query = Produto.find();
			if (fiscal) {
				query.where({fiscal: 1});
			} 
			query.populate(['categoria', 'estoques']).exec(function (err, produtos) {
				if (err) {
					console.log(JSON.stringify(err));
					return res.send(JSON.stringify(err));
				}
				let viewConfig = {

				};
				PermissaoService.hasEditDeletePermissao({
					req: req,
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
		});
	},
	delete: function (req, res) {
		Produto.destroy({id: req.body.id}).exec(function (err) {
			console.log(JSON.stringify(err));
			return res.send({statusCode: 200});
		});
	},
	edit: function(req, res) {
		let dbCalls = [];
		let viewObj = {};

		dbCalls.push(function (callback) {
			Produto.findOne({id: req.param('id')}).populate(['categoria', 'precos', 'estoques', 'fornecedor', 
				'galeria', 'atributos', 'valoresAtributos']).exec(function (err, produto) {
				if (err) {
					callback(err);
				}
				viewObj.produto = produto;
				callback(null);
			});
		});
		dbCalls.push(function (callback) {
			TabelaPreco.find().exec(function (err, tabelasPreco) {
				if (err) {
					callback(err);
				}
				viewObj.tabelasPreco = tabelasPreco;
				callback(null);
			});
		});
		dbCalls.push(function (callback) {
			Estoque.find().exec(function (err, estoques) {
				if (err) {
					callback(err);
				}
				viewObj.estoques = estoques;
				callback(null);
			});
		});

		async.parallel(dbCalls, function (err, results) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.view(viewObj);
		});
	},
	create: function (req, res) {
		let dbCalls = [];
		let viewObj = {};

		dbCalls.push(function (callback) {
			TabelaPreco.find().exec(function (err, tabelasPreco) {
				if (err) {
					callback(err);
				}
				viewObj.tabelasPreco = tabelasPreco;
				callback(null);
			});
		});
		dbCalls.push(function (callback) {
			Estoque.find().exec(function (err, estoques) {
				if (err) {
					callback(err);
				}
				viewObj.estoques = estoques;
				callback(null);
			});
		});


		async.parallel(dbCalls, function (err, results) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.view(viewObj);
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
		let fotos = req.body.fotos || [];
		let atributos = req.body.atributos || [];
		let newProd = req.body.produto;
		if (newProd.fiscal) {
			newProd.fiscal = 0;
		}
		else {
			newProd.fiscal = 1;
		}
		Produto.create(req.body.produto).exec(function (err, produtoDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			let dbCalls = [];
			for (let i = 0; i < fotos.length; i++) {
				dbCalls.push(function (callback) {
					Foto.create({
						foto64: fotos[i].foto64,
						produto: produtoDB.id}).exec(function (err, fotoDB) {
							if (err) {
								callback(err);
								return;
							}
							console.log(JSON.stringify(fotoDB));
							callback(null);
						});
				});
			}

			for (let i = 0; i < atributos.length; i++) {
				let atributosValores = atributos[i].valoresStr.split(';');
				console.log(JSON.stringify(atributosValores));

				dbCalls.push(function (callback) {
					Atributo.create({
						nome: atributos[i].nome,
						produto: produtoDB.id}).exec(function (err, atributoDB) {
							if (err) {
								callback(err);
								return;
							}
							for (let v = 0; v < atributosValores.length; v++) {
								let newValor = {
									nome: atributosValores[v],
									atributo: atributoDB.id,
									produto: atributoDB.produto
								}
								ValorAtributo.create(newValor).exec(function (err, valor) {
									if (err) {
										callback(err);
										return;
									}
									console.log('New Valor: ' + JSON.stringify(valor));
								});
							}
							callback(null);
						});
				});
			}
			async.parallel(dbCalls, function (err, results) {
				if (err) {
					console.log(JSON.stringify(err));
					return res.send(JSON.stringify(err));
				}
				return res.send({statusCode: 200, produto: produtoDB});
			});
		});
	}
};