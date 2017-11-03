/**
 * MoedaController
 *
 * @description :: Server-side logic for managing Moedas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	teste: function (req, res) {
		CotacaoService.getCotacao({}, function (result) {
			return res.send(result);
		});
	},
	getAll: function (req, res) {
		Moeda.find().exec(function (err, moedas) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.send(moedas);
		});
	},
	delete: function (req, res) {
		Moeda.destroy({id: req.body.id}).exec(function (err) {
			if (err) {
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200});
		});
	},
	index: function (req, res) {
		Moeda.find().exec(function (err, moedas) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			PermissaoService.hasEditDeletePermissao({
				userId: req.session.me,
				insertPath: '/moeda/create',
				deletePath: '/moeda/delete',
				editPath: '/moeda/edit'
			}, function (resultPermissao) {
				return res.view('crud.ejs', {
					fields: [
						{
							titulo: 'Descrição',
							nome: 'descricao'
						},
						{
							titulo: 'Símbolo',
							nome: 'simbolo'
						}
					],
					records: moedas,
					options: {
						insert: 'Nova Moeda',
						insertURL: '/moeda/create',
						updateURL: '/moeda/edit',
						deleteURL: '/moeda/delete',
						searchField: {
							descricao: 'Descrição',
							type: 'text',
							nome: 'descricao'
						},
						permissoes: resultPermissao
					}
				});
			});
		});
	},
	edit: function(req, res) {
		Moeda.find({id: req.param('id')}).exec(function (err, moedas) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.view({moeda: moedas[0], moedasSite: ['Peso Uruguaio', 'Dólar', 'Peso Argentino', 'Real', 'Euro']});
		});
	},
	create: function (req, res) {
		return res.view({moedasSite: ['Peso Uruguaio', 'Dólar', 'Peso Argentino', 'Real', 'Euro']});
	},
	editPost: function (req, res) {
		Moeda.update({id: req.body.id}, req.body.moeda).exec(function (err, moedaDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200, moeda: moedaDB});
		});
	},
	createPost: function (req, res) {
		Moeda.create(req.body.moeda).exec(function (err, moedaDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}

			return res.send({statusCode: 200, moeda: moedaDB});
		});
	}
};

