/**
 * PermissaoController
 *
 * @description :: Server-side logic for managing Permissaos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function (req, res) {
		Permissao.find().exec(function (err, permissoes) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			PermissaoService.hasEditDeletePermissao({
				req: req,
				insertPath: '/permissao/create',
				deletePath: '/permissao/delete',
				editPath: '/permissao/edit'
			}, function (resultPermissao) {
				return res.view('crud.ejs', {
					fields: [
						{
							titulo: 'Nome',
							nome: 'nome'
						},
						{
							titulo: 'Path',
							nome: 'path'
						}
					],
					records: permissoes,
					options: {
						insert: 'Nova Permissão',
						insertURL: '/permissao/create',
						updateURL: '/permissao/edit',
						deleteURL: '/permissao/delete',
						searchField: {
							descricao: 'Nome',
							type: 'text',
							nome: 'nome'
						},
						permissoes: resultPermissao
					}
				});
			});
		});
	},
	create: function (req, res) {
		return res.view();
	},
	edit: function (req, res) {
		Permissao.findOne({id: req.param('id')}).exec(function (err, permissao) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.view({permissao: permissao});
		});
	},
	editPost: function (req, res) {
		Permissao.update({id: req.body.id}, req.body.permissao).exec(function (err, permissaoDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200, permissao: permissaoDB});
		});
	},
	createPost: function (req, res) {
		//validate(req.body, function (produto) {
		Permissao.create(req.body.permissao).exec(function (err, permissaoDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}

			return res.send({statusCode: 200, permissao: permissaoDB});
		});
	},
	delete: function (req, res) {
		Permissao.destroy({id: req.body.id}).exec(function (err) {
			if (err) {
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200});
		});
	},
	deleteAll: function (req, res) {
		Permissao.destroy({}, function (err) {
			return res.send('/dashboard');
		});
	},
	createDefaults: function (req, res) {
		PermissaoService.insertDefaults(function () {
			return res.redirect('/dashboard');
		});
	}
};

