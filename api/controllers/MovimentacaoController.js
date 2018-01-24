/**
 * MovimentacaoController
 *
 * @description :: Server-side logic for managing Movimentacaos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var moment = require('moment');

function create(cb) {
	let dbCalls = [];
	let viewObj = {};

	dbCalls.push(function (callback) {
		PermissaoService.isFiscal({userId: req.session.me }, function (fiscal) {
			var query = Produto.find();
			if (fiscal) {
				query.where({fiscal: true});
			} 
			query.populate('estoques').exec(function (err, produtos) {
				if (err) {
					callback(err);
				}
				
				viewObj.produtos = produtos;
				callback(null, produtos);	
			});
		});
	});
	
	dbCalls.push(function (callback) {
		Estoque.find().exec(function (err, estoques) {
			if (err) {
				callback(err);
			}
			viewObj.estoques = estoques;
			callback(null, estoques);
		});
	});
	async.parallel(dbCalls, function (err, results) {
		if (err) {
			console.log(JSON.stringify(err));
			cb(err);
		}
		cb(null, viewObj);
	});
}

module.exports = {
	index: function (req, res) {
		Movimentacao.find({estoqueSaida: {'!': null}, estoqueEntrada: {'!': null}}).populate(['items', 'estoqueEntrada', 'estoqueSaida']).exec(function (err, movimentacoes) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.view('movimentacao/index.ejs', {insertURL: '/movimentacao/create', titulo: 'Movimentação', entradaSaida: 0, movimentacoes: movimentacoes, moment: moment});
		});
	},
	indexEntrada: function (req, res) {
		Movimentacao.find({estoqueSaida: null, estoqueEntrada: {'!': null}}).populate(['items', 'estoqueEntrada', 'estoqueSaida']).exec(function (err, movimentacoes) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.view('movimentacao/index.ejs', {insertURL: '/movimentacao/entrada', titulo: 'Entrada', entradaSaida: 1, movimentacoes: movimentacoes, moment: moment});
		});
	},
	indexSaida: function (req, res) {
		Movimentacao.find({estoqueSaida: {'!': null}, estoqueEntrada: null}).populate(['items', 'estoqueEntrada', 'estoqueSaida']).exec(function (err, movimentacoes) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.view('movimentacao/index.ejs', {insertURL: '/movimentacao/saida', titulo: 'Saída', entradaSaida: 2, movimentacoes: movimentacoes, moment: moment});
		});
	},
	cancelar: function (req, res) {
		Movimentacao.findOne({id: req.body.id}).populate('items').exec(function (err, movimentacao) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			movimentacao.estornarItems(function () {
				Movimentacao.destroy({id: movimentacao.id}).exec(function (err) {
					if (err) {
						console.log(JSON.stringify(err));
						return res.send(JSON.stringify(err));
					}
					return res.send({statusCode: 200});		
				});
			});
		});
	},
	createPost: function (req, res) {
		let itemsMovi = req.body.movimentacao.items;
		Movimentacao.create(req.body.movimentacao).exec(function (err, movi) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			movi.insertItems(itemsMovi, function() {
				return res.send({statusCode: 200});
			});
		});
	},
	getDetail: function (req, res) {
		Movimentacao.findOne({id: req.body.id}).populate(['items']).exec(function (err, movimentacao) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			var i = 0;
			movimentacao.items.forEach(function (item, index) {
				ItemMovimentacao.findOne({id: item.id}).populate(['produto']).exec(function (err, _item) {
					item.produto = _item.produto.toObject();
					i++;

					if (i == movimentacao.items.length) {
						return res.send({movimentacao: movimentacao});
					}
				});
			});
		})
	},
	create: function (req, res) {
		create(function (err, viewObj) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.view(viewObj);
		});
	},
	entrada: function (req, res) {
		create(function (err, viewObj) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.view(viewObj);
		});	
	},
	saida: function (req, res) {
		create(function (err, viewObj) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.view(viewObj);
		});	
	}
};

