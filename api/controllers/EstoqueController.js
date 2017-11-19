/**
 * EstoqueController
 *
 * @description :: Server-side logic for managing Estoques
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getAll: function (req, res) {
		Estoque.find().exec(function (err, estoques) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.send(estoques);
		});
	},
	index: function (req, res) {
		Estoque.find().exec(function (err, estoques) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}

			PermissaoService.hasEditDeletePermissao({
				userId: req.session.me,
				insertPath: '/estoque/create',
				deletePath: '/estoque/delete',
				editPath: '/estoque/edit'
			}, function (resultPermissao) {
				return res.view('crud.ejs', {
					fields: [
						{
							titulo: 'Descrição',
							nome: 'descricao'
						}
					],
					records: estoques,
					options: {
						insert: 'Novo Estoque',
						insertURL: '/estoque/create',
						updateURL: '/estoque/edit',
						deleteURL: '/estoque/delete',
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
	delete: function (req, res) {
		Estoque.destroy({id: req.body.id}).exec(function (err) {
			if (err) {
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200});
		});
	},
	edit: function(req, res) {
		Estoque.find({id: req.param('id')}).exec(function (err, estoques) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.view({estoque: estoques[0]});
		});
	},
	create: function (req, res) {
		return res.view();
	},
	editPost: function (req, res) {
		Estoque.update({id: req.body.id}, req.body.estoque).exec(function (err, estoqueDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200, estoque: estoqueDB});
		});
	},
	createPost: function (req, res) {
		//validate(req.body, function (produto) {
		Estoque.create(req.body.estoque).exec(function (err, estoqueDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}

			return res.send({statusCode: 200, estoque: estoqueDB});
		});
	}
};


