/**
 * TabelaPrecoController
 *
 * @description :: Server-side logic for managing Tabelaprecoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function (req, res) {
		TabelaPreco.find().exec(function (err, tabelasPreco) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.view('crud.ejs', {
				fields: [
					{
						titulo: 'Descrição',
						nome: 'descricao'
					}
				],
				records: tabelasPreco,
				options: {
					insert: 'Nova Tabela de Preço',
					insertURL: '/tabelaPreco/create',
					updateURL: '/tabelaPreco/edit',
					deleteURL: '/tabelaPreco/delete',
					searchField: {
						descricao: 'Descrição',
						type: 'text',
						nome: 'descricao'
					}
				}
			});
		});
	},
	delete: function (req, res) {
		TabelaPreco.destroy({id: req.body.id}).exec(function (err) {
			if (err) {
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200});
		});
	},
	edit: function(req, res) {
		TabelaPreco.find({id: req.param('id')}).exec(function (err, tabelasPreco) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.view('tabelaPreco/edit.ejs', {tabelaPreco: tabelasPreco[0]});
		});
	},
	create: function (req, res) {
		return res.view('tabelaPreco/create.ejs');
	},
	editPost: function (req, res) {
		TabelaPreco.update({id: req.body.id}, req.body.tabelaPreco).exec(function (err, tabelaPrecoDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200, tabelaPreco: tabelaPrecoDB});
		});
	},
	createPost: function (req, res) {
		//validate(req.body, function (produto) {
		TabelaPreco.create(req.body.tabelaPreco).exec(function (err, TabelaPrecoDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}

			return res.send({statusCode: 200, tabelaPreco: TabelaPrecoDB});
		});
	}
};

