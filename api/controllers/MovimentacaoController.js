/**
 * MovimentacaoController
 *
 * @description :: Server-side logic for managing Movimentacaos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var moment = require('moment');


module.exports = {
	index: function (req, res) {
		Movimentacao.find().populate(['items']).exec(function (err, movimentacoes) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.view({movimentacoes: movimentacoes, moment: moment});
		});
	},
	create: function (req, res) {
		let dbCalls = [];
		let viewObj = {};

		dbCalls.push(function (callback) {
			Produto.find().populate('estoques').exec(function (err, produtos) {
				if (err) {
					callback(err);
				}
				
				viewObj.produtos = produtos;
				callback(null, produtos);	
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
			}
			return res.view(viewObj);
		});
	}	
};

