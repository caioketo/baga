/**
 * PromocaoController
 *
 * @description :: Server-side logic for managing Promocaos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function (req, res) {
		Promocao.find().populate(['items', 'produto']).exec(function (err, promocoes) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.view({promocoes: promocoes});
		});
	},
	createPost: function (req, res) {
		let itemsPromocao = req.body.promocao.items;
		Promocao.create(req.body.promocao).exec(function (err, movi) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			//movi.insertItems(itemsMovi, function() {
			return res.send({statusCode: 200});
			//});
		});
	},
	create: function (req, res) {
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
		async.parallel(dbCalls, function (err, results) {
			if (err) {
				console.log(JSON.stringify(err));
				cb(err);
			}
			return res.view(viewObj);
		});		
	},
	edit: function (req, res) {
		return res.view();
	},
	editPost: function (req, res) {

	}
};

