/**
 * FornecedorController
 *
 * @description :: Server-side logic for managing Fornecedors
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getAll: function (req, res) {
		Fornecedor.find().exec(function (err, fornecedores) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.send(fornecedores);
		});
	},
	delete: function (req, res) {
		Fornecedor.destroy({id: req.body.id}).exec(function (err) {
			if (err) {
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200});
		});
	},
	index: function (req, res) {
		Fornecedor.find().exec(function (err, fornecedores) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.view('crud.ejs', {
				fields: [
					{
						titulo: 'RUT',
						nome: 'rut'
					},
					{
						titulo: 'Nome',
						nome: 'nome'
					}
				],
				records: fornecedores,
				options: {
					insert: 'Novo Fornecedor',
					insertURL: '/fornecedor/create',
					updateURL: '/fornecedor/edit',
					deleteURL: '/fornecedor/delete',
					searchField: {
						descricao: 'Nome',
						type: 'text',
						nome: 'nome'
					}
				}
			});
		});
	},
	edit: function(req, res) {
		Fornecedor.find({id: req.param('id')}).exec(function (err, fornecedores) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.view({fornecedor: fornecedores[0]});
		});
	},
	create: function (req, res) {
		return res.view();
	},
	editPost: function (req, res) {
		Fornecedor.update({id: req.body.id}, req.body.fornecedor).exec(function (err, fornecedorDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200, fornecedor: fornecedorDB});
		});
	},
	createPost: function (req, res) {
		Fornecedor.create(req.body.fornecedor).exec(function (err, fornecedorDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}

			return res.send({statusCode: 200, fornecedor: fornecedorDB});
		});
	}
};

