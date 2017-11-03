/**
 * VendedorController
 *
 * @description :: Server-side logic for managing Vendedors
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getAll: function (req, res) {
		Vendedor.find().exec(function (err, vendedores) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.send(vendedores);
		});
	},
	index: function (req, res) {
		PermissaoService.hasEditDeletePermissao({
			userId: req.session.me,
			insertPath: '/vendedor/create',
			deletePath: '/vendedor/delete',
			editPath: '/vendedor/edit'
		}, function (resultPermissao) {
			Vendedor.find().exec(function (err, vendedores) {
				if (err) {
					console.log(JSON.stringify(err));
					return res.send(JSON.stringify(err));
				}
				return res.view('crud.ejs', {
					fields: [
						{
							titulo: 'Nome',
							nome: 'nome'
						}
					],
					records: vendedores,
					options: {
						insert: 'Novo Vendedor',
						insertURL: '/vendedor/create',
						updateURL: '/vendedor/edit',
						deleteURL: '/vendedor/delete',
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
	delete: function (req, res) {
		Vendedor.destroy({id: req.body.id}).exec(function (err) {
			if (err) {
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200});
		});
	},
	edit: function(req, res) {
		Vendedor.find({id: req.param('id')}).exec(function (err, vendedores) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.view({vendedor: vendedores[0]});
		});
	},
	create: function (req, res) {
		return res.view();
	},
	editPost: function (req, res) {
		Vendedor.update({id: req.body.id}, req.body.vendedor).exec(function (err, vendedorDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}

			return res.send({statusCode: 200, vendedor: vendedorDB});
		});
	},
	createPost: function (req, res) {
		//validate(req.body, function (produto) {
		Vendedor.create(req.body.vendedor).exec(function (err, vendedorDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}

			return res.send({statusCode: 200, vendedor: vendedorDB});
		});
	}
};

