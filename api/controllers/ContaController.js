/**
 * ContaController
 *
 * @description :: Server-side logic for managing Contas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getAll: function (req, res) {
		Conta.find().exec(function (err, contas) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.send(contas);
		});
	},
	index: function (req, res) {
		Conta.find().exec(function (err, contas) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}

			for (var i = contas.length - 1; i >= 0; i--) {
				contas[i]['tipoDesc'] = contas[i].tipoDesc();
			}

			PermissaoService.hasEditDeletePermissao({
				userId: req.session.me,
				insertPath: '/conta/create',
				deletePath: '/conta/delete',
				editPath: '/conta/edit'
			}, function (resultPermissao) {
				return res.view('crud.ejs', {
					fields: [
						{
							titulo: 'Descrição',
							nome: 'descricao'
						},
						{
							titulo: 'Tipo',
							nome: 'tipoDesc'
						}
					],
					records: contas,
					options: {
						insert: 'Nova Conta',
						insertURL: '/conta/create',
						updateURL: '/conta/edit',
						deleteURL: '/conta/delete',
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
		Conta.destroy({id: req.body.id}).exec(function (err) {
			if (err) {
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200});
		});
	},
	edit: function(req, res) {
		Conta.find({id: req.param('id')}).exec(function (err, contas) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.view({conta: contas[0]});
		});
	},
	create: function (req, res) {
		return res.view();
	},
	editPost: function (req, res) {
		Conta.update({id: req.body.id}, req.body.conta).exec(function (err, contaDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200, conta: contaDB});
		});
	},
	createPost: function (req, res) {
		//validate(req.body, function (produto) {
		Conta.create(req.body.conta).exec(function (err, contaDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}

			return res.send({statusCode: 200, conta: contaDB});
		});
	}
};

