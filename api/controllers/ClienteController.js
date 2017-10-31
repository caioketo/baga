/**
 * ClienteController
 *
 * @description :: Server-side logic for managing Clientes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getAll: function (req, res) {
		Cliente.find().exec(function (err, clientes) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.send(clientes);
		});
	},
	delete: function (req, res) {
		Cliente.destroy({id: req.body.id}).exec(function (err) {
			if (err) {
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200});
		});
	},
	index: function (req, res) {
		Cliente.find().exec(function (err, clientes) {
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
					},
					{
						titulo: 'E-mail',
						nome: 'email'
					}
				],
				records: clientes,
				options: {
					insert: 'Novo Cliente',
					insertURL: '/cliente/create',
					updateURL: '/cliente/edit',
					deleteURL: '/cliente/delete',
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
		TabelaPreco.find().exec(function (err, tabelasPreco) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			Cliente.find({id: req.param('id')}).populate('tabelaPreco').exec(function (err, clientes) {
				if (err) {
					console.log(JSON.stringify(err));
					return res.send(JSON.stringify(err));
				}
				return res.view({cliente: clientes[0], tabelasPreco: tabelasPreco});
			});
		});
	},
	create: function (req, res) {
		TabelaPreco.find().exec(function (err, tabelasPreco) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.view({tabelasPreco: tabelasPreco});
		});
	},
	editPost: function (req, res) {
		Cliente.update({id: req.body.id}, req.body.cliente).exec(function (err, clienteDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200, cliente: clienteDB});
		});
	},
	createPost: function (req, res) {
		//validate(req.body, function (produto) {
		Cliente.create(req.body.cliente).exec(function (err, clienteDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}

			return res.send({statusCode: 200, cliente: clienteDB});
		});
	}	
};

