/**
 * GrupoPermissaoController
 *
 * @description :: Server-side logic for managing Grupopermissaos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function (req, res) {
		GrupoPermissao.find().exec(function (err, grupos) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			PermissaoService.hasEditDeletePermissao({
				req: req,
				insertPath: '/grupopermissao/create',
				deletePath: '/grupopermissao/delete',
				editPath: '/grupopermissao/edit'
			}, function (resultPermissao) {
				return res.view('crud.ejs', {
					fields: [
						{
							titulo: 'Nome',
							nome: 'nome'
						}
					],
					records: grupos,
					options: {
						insert: 'Novo Grupo',
						insertURL: '/grupopermissao/create',
						updateURL: '/grupopermissao/edit',
						deleteURL: '/grupopermissao/delete',
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
		PermissaoService.getListPermissoes(function (permissoes) {
			return res.view({permissoes: permissoes});
		});
	},
	edit: function (req, res) {
		GrupoPermissao.findOne({id: req.param('id')}).populate('permissoes').exec(function (err, grupo) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			PermissaoService.getListPermissoes(function (permissoes) {
				return res.view({grupo: grupo, permissoes: permissoes});
			});
		});
	},
	editPost: function (req, res) {
		GrupoPermissao.update({id: req.body.id}, req.body.grupo).exec(function (err, grupoDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200, grupo: grupoDB});
		});
	},
	createPost: function (req, res) {
		//validate(req.body, function (produto) {
		GrupoPermissao.create(req.body.grupo).exec(function (err, grupoDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}

			return res.send({statusCode: 200, grupo: grupoDB});
		});
	},
	delete: function (req, res) {
		GrupoPermissao.destroy({id: req.body.id}).exec(function (err) {
			if (err) {
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200});
		});
	},
};

