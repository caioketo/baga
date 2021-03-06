/**
 * VendaController
 *
 * @description :: Server-side logic for managing Vendas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var moment = require('moment');
var fs = require('fs');
var jsreport = require('jsreport-core')();
jsreport.use(require('jsreport-handlebars')());
jsreport.use(require('jsreport-phantom-pdf')());


var helpers = 'function now() { return new Date().toLocaleDateString(); } function nowPlus20Days() { var date = new Date(); date.setDate(date.getDate() + 20); return date.toLocaleDateString(); } function total(itens) {    var sum = 0;    itens.forEach(function (i) {	sum += i.preco;    });    return sum;}';

function getPagamentos(formasPagamento) {
	let pagamentos = [];
	let id = 0;
	for (var i = 0; i < formasPagamento.length; i++) {
		for (var l = 0; l < formasPagamento[i].condicoesPagamento.length; l++) {
			pagamentos.push({
				id: id,
				formaPagamento: formasPagamento[i].id,
				condicaoPagamento: formasPagamento[i].condicoesPagamento[l].id,
				descricao: formasPagamento[i].descricao + ' (' + formasPagamento[i].condicoesPagamento[l].descricao + ')',
				cotacao: formasPagamento[i].cotacao
			});
			id++;
		}
	}
	return pagamentos;
}

function criarLancamento(lancamento) {
	Lancamento.create(lancamento).exec(function (err, lancamentoDB) {
		if (err) {
			console.log(JSON.stringify(err));
			return;
		}
	});
}

function lancarPagamento(venda, cliente, pagamento, formaPagamento, condicaoPagamento) {
	let dataNow = new Date();

	let lancamento = {
		descricao: 'Pagamento Venda ' + venda,
		data: dataNow,
		conta: formaPagamento.conta.id,
		moeda: formaPagamento.moeda.id,
		cliente: cliente,
		pago: false,
		venda: venda
	};
	if (condicaoPagamento.aVista) {
		lancamento.vencimento = dataNow;
		lancamento.valor = pagamento.valor;
		criarLancamento(lancamento);
	}
	else {
		lancamento.vencimento = new Date(dataNow.getTime() + (condicaoPagamento.primeiraParcela * 86400000 ));
		lancamento.valor = (pagamento.valor / condicaoPagamento.parcelas);
		criarLancamento(lancamento);

		for (let i = 1; i < condicaoPagamento.parcelas; i++) {
			lancamento.vencimento = new Date(dataNow.getTime() + (((condicaoPagamento.intervalo * i) + 
				condicaoPagamento.primeiraParcela) * 86400000));
			criarLancamento(lancamento);
		}
	}
}



module.exports = {
	printaVenda: function (req, res) {
		Venda.findOne({id: req.param('id')}).populate(['itens', 'cliente', 'vendedor']).exec(function (err, _venda) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			_venda.createdAtMoment = moment(_venda.createdAt).format('DD/MM/YYYY');
			console.log(JSON.stringify(_venda));
			jsreport.init().then(function () {
				jsreport.render({
					template: {
						content: fs.readFileSync("./views/venda/vendaImpresso.html", 'utf8'),
						//content: vendaTemplate,
						engine: 'handlebars',
						recipe: 'phantom-pdf',
						helpers: helpers
					},
					scripts: [{
						content: "function now() {return new Date().toLocaleDateString()}function nowPlus20Days() {    var date = new Date()    date.setDate(date.getDate() + 20);    return date.toLocaleDateString();}function total(itens) {    var sum = 0;    itens.forEach(function (i) {        console.log('Calculating item ' + i.name + '; you should see this message in debug run')        sum += i.price    })    return sum}"
					}],
					data: _venda
				}).then(function(resp) {
					return resp.stream.pipe(res);
					//fs.writeFileSync('report.pdf', resp.content);
					//return fs.createReadStream('report.pdf').pipe(res);
					//return res.send(resp.content);
				});
			});
		});
	},
	cancelarVenda: function (req, res) {
		Venda.update({id: req.body.id}, {cancelada: true}).exec(function (err, _venda) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			//Ao invés de excluir lançar estorno caso caixa
			Lancamento.find({venda: _venda[0].id}).populate('conta').exec(function (err, lancamentos) {
				if (err) {
					console.log(JSON.stringify(err));
					return res.send(JSON.stringify(err));
				}
				lancamentos.forEach(function (lancamento, index) {
					if (lancamento.conta.tipo == 0) {
						//Lançar estorno
						Lancamento.create({
							descricao: 'Estorno - ' + lancamento.descricao,
							data: lancamento.data,
							conta: lancamento.conta.id,
							moeda: lancamento.moeda,
							cliente: lancamento.cliente,
							pago: false,
							venda: lancamento.venda,
							valor: (lancamento.valor * (-1))
						}).exec(function (err) {
							if (err) {
								console.log(JSON.stringify(err));
								return res.send(JSON.stringify(err));
							}
						});
					}
					else {
						Lancamento.destroy({id: lancamento.id}).exec(function (err) {
							if (err) {
								console.log(JSON.stringify(err));
								return res.send(JSON.stringify(err));
							}
						});
					}
				});
			});
			Venda.find({id: _venda[0].id}).populate(['itens', 'pagamentos']).exec(function (err, venda) {
				venda = venda[0];
				if (err) {
					console.log(JSON.stringify(err));
					return res.send(JSON.stringify(err));
				}
				venda.itens.forEach(function (item, index) {
					Produto.findOne({id: item.produto}).exec(function (err, produto) {
						if (err) {
							console.log(JSON.stringify(err));
						}
						Produto.update({id: item.produto}, {quantidade: (produto.quantidade + item.quantidade)}).exec(function (err, _produto) {
							if (err) {
								console.log(JSON.stringify(err));
							}
						});
					});
				});
			});
			return res.send({statusCode: 200});
		});
	},
	index: function (req, res) {
		PermissaoService.isFiscal({userId: req.session.me }, function (fiscal) {
			var query = Venda.find({cancelada: false});
			if (fiscal) {
				query.where({impresso: { '>': 0 }});
			} 
			query.populate(['cliente', 'vendedor']).exec(function (err, vendas) {
				if (err) {
					console.log(JSON.stringify(err));
					return res.send(JSON.stringify(err));
				}
				return res.view({vendas: vendas, moment: moment});
			});
		});
	},
	getDetail: function (req, res) {
		let vendaID = req.body.vendaID;
		Venda.find({id: vendaID}).populate(['itens', 'pagamentos']).exec(function (err, vendas) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			let venda = vendas[0];
			var i = 0;
			venda.itens.forEach(function (item, index) {
				ItemVenda.findOne({id: item.id}).populate(['produto', 'loja']).exec(function (err, _item) {
					item.produto = _item.produto.toObject();
					item.loja = _item.loja.toObject();
					i++;

					if (i == venda.itens.length) {
						var j = 0;
						venda.pagamentos.forEach(function (pagamento, index) {
							PagamentoVenda.findOne({id: pagamento.id}).populate('formaPagamento').exec(function (err, _pagamento) {
								pagamento.formaPagamento = _pagamento.formaPagamento.toObject();
								j++;

								if (j == venda.pagamentos.length) {
									return res.send({venda: venda});
								}
							});
						});
					}
				});
			});
		})
	},
	createPost: function (req, res) {
		CaixaService.getAbertura(function (err, abertura) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			req.body.venda.abertura = abertura.id;
			Venda.create(req.body.venda).exec(function (err, vendaDB) {
				if (err) {
					console.log(JSON.stringify(err));
					return res.send(JSON.stringify(err));
				}
				Venda.findOne({id: vendaDB.id}).populate(['itens', 'pagamentos']).exec(function (err, venda) {
					venda.itens.forEach(function (item, index) {
						Produto.findOne({id: item.produto}).exec(function (err, produto) {
							if (err) {
								console.log(JSON.stringify(err));
							}
							Produto.update({id: item.produto}, {quantidade: (produto.quantidade - item.quantidade)}).exec(function (err, _produto) {
								if (err) {
									console.log(JSON.stringify(err));
								}
							});
						});
					});

					venda.pagamentos.forEach(function (pagamento, index) {
						//lancar pagamento na conta....
						FormaPagamento.findOne({id: pagamento.formaPagamento}).populate(['moeda', 'conta', 'condicoesPagamento']).exec(function (err, _formaPagamento) {
							if (err) {
								console.log(JSON.stringify(err));
							}

							_formaPagamento.condicoesPagamento.forEach(function (condicao, index) {
								if (condicao.id == pagamento.condicaoPagamento) {
									lancarPagamento(vendaDB.numero, vendaDB.cliente, pagamento, _formaPagamento, condicao);
								}
							});
						});
					});
				});
					 

				return res.send({statusCode: 200});
			});
		});
	},
	createOrcamento: function (req, res) {
		let viewObj = {};
		Loja.find().exec(function (err, lojas) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			console.log('lojas');
			viewObj.lojas = lojas;
			TabelaPreco.find().exec(function (err, tabelas) {
				if (err) {
					console.log(JSON.stringify(err));
					return res.send(JSON.stringify(err));
				}
				console.log('tabelas');
				viewObj.tabelas = tabelas;
				PermissaoService.isFiscal({userId: req.session.me }, function (fiscal) {
					var query = Produto.find();
					if (fiscal) {
						query.where({fiscal: true});
					}
					query.populate('precos').exec(function (err, produtos) {
						if (err) {
							console.log(JSON.stringify(err));
							return res.send(JSON.stringify(err));
						}
						console.log('produtos');
						viewObj.produtos = produtos;
						Cliente.getDefault(function (_cliente) {
							console.log('cliente');
							viewObj.cliente = _cliente;
							Vendedor.getDefault({userId: req.session.me}, function (_vendedor) {
								console.log('vendedor');
								viewObj.vendedor = _vendedor;
								FormaPagamento.find().populate(['condicoesPagamento', 'moeda']).exec(function (err, formasPagamento) {
									FormaPagamento.getCotacaoMoedas(formasPagamento, function (_formasPagamento) {
										viewObj.formasPagamento = getPagamentos(_formasPagamento);
										return res.view(viewObj);
									});
								});
							});
						});	
					});
				});
			});
		});	
	},
	create: function (req, res) {
		CaixaService.getAbertura(function (err, abertura) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}

			if (typeof abertura == 'undefined') {
				return res.redirect('/abertura/abrirCaixa');
			}
			let dbCalls = [];
			let viewObj = {};

			dbCalls.push(function (callback) {
				PermissaoService.isFiscal({userId: req.session.me }, function (fiscal) {
					var query = Produto.find();
					if (fiscal) {
						query.where({fiscal: 1});
					} 
					query.populate(['precos', 'estoques']).exec(function (err, produtos) {
						if (err) {
							callback(err);
						}
						
						viewObj.produtos = produtos;
						callback(null, produtos);
					});
				});
			});
			
			dbCalls.push(function (callback) {
				Loja.find().exec(function (err, lojas) {
					if (err) {
						callback(err);
					}
					viewObj.lojas = lojas;
					callback(null, lojas);
				});
			});

			dbCalls.push(function (callback) {
				TabelaPreco.find().exec(function (err, tabelas) {
					if (err) {
						console.log(JSON.stringify(err));
						callback(err);
					}

					viewObj.tabelas = tabelas;
					callback(null, tabelas);
				});
			});

			dbCalls.push(function (callback) {
				Estoque.find().exec(function (err, estoques) {
					if (err) {
						console.log(JSON.stringify(err));
						callback(err);
					}

					viewObj.estoques = estoques;
					callback(null, estoques);
				});
			});

			dbCalls.push(function (callback) {
				Cliente.getDefault(function (_cliente) {
					viewObj.cliente = _cliente;
					callback(null, _cliente);
				});
			});
			
			dbCalls.push(function (callback) {
				Vendedor.getDefault({userId: req.session.me}, function (_vendedor) {
					viewObj.vendedor = _vendedor;
					callback(null, _vendedor);
				});
			});

			dbCalls.push(function (callback) {
				FormaPagamento.find().populate(['condicoesPagamento', 'moeda']).exec(function (err, formasPagamento) {
					FormaPagamento.getCotacaoMoedas(formasPagamento, function (_formasPagamento) {
						viewObj.formasPagamento = getPagamentos(_formasPagamento);
						callback(null, _formasPagamento);
					});
				});
			});

			async.parallel(dbCalls, function (err, results) {
				if (err) {
					console.log(JSON.stringify(err));
					return res.send(JSON.stringify(err));
				}
				return res.view(viewObj);
			});
		});
	}
};

