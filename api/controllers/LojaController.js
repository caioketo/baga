/**
 * LojaController
 *
 * @description :: Server-side logic for managing Lojas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getAll: function (req, res) {
		Loja.find().exec(function (err, lojas) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.send(lojas);
		});
	},
	delete: function (req, res) {
		Loja.destroy({id: req.body.id}).exec(function (err) {
			if (err) {
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200});
		});
	},
	index: function (req, res) {
		Loja.find().exec(function (err, lojas) {
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
				records: lojas,
				options: {
					insert: 'Novo Loja',
					insertURL: '/loja/create',
					updateURL: '/loja/edit',
					deleteURL: '/loja/delete'
				}
			});
		});
	},
	edit: function(req, res) {
		Loja.find({id: req.param('id')}).exec(function (err, lojas) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.view({loja: lojas[0]});
		});
	},
	create: function (req, res) {
		return res.view();
	},
	editPost: function (req, res) {
		Loja.update({id: req.body.id}, req.body.loja).exec(function (err, lojaDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200, loja: lojaDB});
		});
	},
	createPost: function (req, res) {
		Loja.create(req.body.loja).exec(function (err, lojaDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}

			return res.send({statusCode: 200, loja: lojaDB});
		});
	}
};

