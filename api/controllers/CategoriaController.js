/**
 * CategoriaController
 *
 * @description :: Server-side logic for managing Categorias
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getAll: function (req, res) {
		Categoria.find().exec(function (err, categorias) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.send(categorias);
		});
	},
	delete: function (req, res) {
		Categoria.destroy({id: req.body.id}).exec(function (err) {
			if (err) {
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200});
		});
	},
	index: function (req, res) {
		PermissaoService.hasEditDeletePermissao({
			req: req,
			insertPath: '/categoria/create',
			deletePath: '/categoria/delete',
			editPath: '/categoria/edit'
		}, function (resultPermissao) {
			Categoria.find().exec(function (err, categorias) {
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
					records: categorias,
					options: {
						insert: 'Nova Categoria',
						insertURL: '/categoria/create',
						updateURL: '/categoria/edit',
						deleteURL: '/categoria/delete',
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
		Categoria.find({id: req.param('id')}).exec(function (err, categorias) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.view({categoria: categorias[0]});
		});
	},
	create: function (req, res) {
		return res.view();
	},
	editPost: function (req, res) {
		Categoria.update({id: req.body.id}, req.body.categoria).exec(function (err, categoriaDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200, categoria: categoriaDB});
		});
	},
	createPost: function (req, res) {
		Categoria.create(req.body.categoria).exec(function (err, categoriaDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}

			return res.send({statusCode: 200, categoria: categoriaDB});
		});
	}
};

