var moment = require('moment');
/**
 * LancamentoController
 *
 * @description :: Server-side logic for managing Lancamentoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict'


/*
	0- Caixa
	1- Conta à Receber 
	2- Conta à Pagar
	3- Conta Corrente
*/
function getContas(tipo, cb) {
	Conta.find({tipo: tipo}).exec(function (err, contas) {
		if (err) {
			console.log(JSON.stringify(err));
			return [];
		}
		var contasId = [];
		for (var i = contas.length - 1; i >= 0; i--) {
			contasId.push(contas[i].id);
		}

		if (cb) {
			cb(contasId);
		}

		return contasId;
	});
}

function getContasObj(tipo, cb) {
	Conta.find({tipo: tipo}).exec(function (err, contas) {
		if (err) {
			console.log(JSON.stringify(err));
			return [];
		}
		if (cb) {
			cb(contas);
		}

		return contas;
	});
}

function getFormasPagamento(cb) {
	FormaPagamento.find({aVista: true}).exec(function (err, formasPagamento) {
		if (err) {
			console.log(JSON.stringify(err));
			cb([]);
			return;
		}
		FormaPagamento.getCotacaoMoedas(formasPagamento, function (_formasPagamento) {
			cb(_formasPagamento);
		});
	});
}


module.exports = {
	index: function (req, res) {
		Lancamento.find({pago: false}).populate(['moeda']).exec(function (err, lancamentos) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}

			return res.view({lancamentos: lancamentos, moment: moment});
		});
	},
	contaCorrenteSel: function (req, res) {
		Lancamento.find({conta: req.body.conta}).populate('moeda').exec(function (err, lancamentos) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.send(lancamentos);
		});
	},
	/*index: function (req, res) {
		Lancamento.find().exec(function (err, results) {
			console.log(JSON.stringify(results))
		});
		return res.view();
	},*/
	contasReceber: function (req, res) {
		getFormasPagamento(function (formasPagamento) {
			getContas(1, function (contas) {
				Lancamento.find({conta: contas, pago: false}).populate(['cliente', 'moeda']).exec(function (err, lancamentos) {
					if (err) {
						console.log(JSON.stringify(err));
						return res.send(JSON.stringify(err));
					}

					return res.view({lancamentos: lancamentos, moment: moment, formasPagamento: formasPagamento});
				});
			});
		});
	},
	contasPagar: function (req, res) {
		getFormasPagamento(function (formasPagamento) {
			getContas(2, function (contas) {
				Lancamento.find({conta: contas, pago: false}).populate(['fornecedor', 'moeda']).exec(function (err, lancamentos) {
					if (err) {
						console.log(JSON.stringify(err));
						return res.send(JSON.stringify(err));
					}

					return res.view({lancamentos: lancamentos, moment: moment, formasPagamento: formasPagamento});
				});
			});
		});
	},
	contasCorrente: function (req, res) {
		getContas(3, function (contas) {
			Lancamento.find({conta: contas, pago: false}).populate(['cliente', 'moeda']).exec(function (err, lancamentos) {
				if (err) {
					console.log(JSON.stringify(err));
					return res.send(JSON.stringify(err));
				}
				getContasObj(3, function (contasObj) {
					return res.view({contas: contasObj, lancamentos: lancamentos, moment: moment});
				});
			});
		});
	},
	caixa: function (req, res) {
		getFormasPagamento(function (formasPagamento) {
			getContas(0, function (contas) {
				Lancamento.find({conta: contas}).populate(['cliente', 'moeda']).exec(function (err, lancamentos) {
					if (err) {
						console.log(JSON.stringify(err));
						return res.send(JSON.stringify(err));
					}

					return res.view({lancamentos: lancamentos, moment: moment, formasPagamento: formasPagamento, total: 0});
				});
			});
		});
	},
	createCR: function (req, res) {
		return res.view({moeda: sails.config.baga.moedaId});
	},
	createCRPost: function (req, res) {
		req.body.lancamento.pago = false;
		getContas(1, function (contas) {
			req.body.lancamento.conta = contas[0];
			Lancamento.create(req.body.lancamento).exec(function (err, lancamentoDB) {
				if (err) {
					console.log(JSON.stringify(err));
					return res.send(JSON.stringify(err));
				}

				return res.send({statusCode: 200, lancamento: lancamentoDB});
			});
		});
	},
	createCP: function (req, res) {
		return res.view({moeda: sails.config.baga.moedaId});
	},
	createCPPost: function (req, res) {
		req.body.lancamento.pago = false;
		getContas(2, function (contas) {
			req.body.lancamento.conta = contas[0];
			Lancamento.create(req.body.lancamento).exec(function (err, lancamentoDB) {
				if (err) {
					console.log(JSON.stringify(err));
					return res.send(JSON.stringify(err));
				}

				return res.send({statusCode: 200, lancamento: lancamentoDB});
			});
		});	
	},
	delete: function (req, res) {
		Lancamento.destroy({id: req.body.id}).exec(function (err) {
			if (err) {
				console.log(JSON.stringify(err));
			}
			return res.send({statusCode: 200});
		});
	},
	baixarConta: function (req, res) {
		let pagamentos = req.body.pagamentos;
		Lancamento.update({id: req.body.id}, {pago: true}).exec(function (err, contaUpdated) {
			for (var i = pagamentos.length - 1; i >= 0; i--) {
				console.log(JSON.stringify(pagamentos[i]));
				if (pagamentos[i].formaPagamento.conta) {
					//Lancar valor na conta
					Lancamento.create({
						data: new Date(),
						vencimento: new Date(),
						valor: pagamentos[i].valor,
						conta: pagamentos[i].formaPagamento.conta,
						descricao: 'Pagamento-' + contaUpdated.descricao,
						moeda: pagamentos[i].formaPagamento.moeda
					}).exec(function (err, pagamentoConta) {
						if (err) {
							console.log(JSON.stringify(err));
						}
					});
				}
			}
			return res.send({statusCode: 200});
		});
	},
	suprimentoSangria: function (req, res) {
		let pagamento = req.body.pagamento;
		getContas(0, function (contas) {
			Lancamento.create({
				data: new Date(),
				vencimento: new Date(),
				valor: pagamento.valor,
				conta: contas[0],
				descricao: pagamento.descricao,
				moeda: pagamento.formaPagamento.moeda
			}).exec(function (err, pagamentoConta) {
				if (err) {
					console.log(JSON.stringify(err));
				}
				return res.send({statusCode: 200});
			});
		});
	}
};

