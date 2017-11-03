/**
 * FormaPagamentoController
 *
 * @description :: Server-side logic for managing Formapagamentoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getAll: function (req, res) {
		FormaPagamento.find().exec(function (err, formasPagamento) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			console.log(JSON.stringify(formasPagamento));
			return res.send(formasPagamento);
		});
	},
	index: function (req, res) {
		FormaPagamento.find().exec(function (err, formasPagamento) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			PermissaoService.hasEditDeletePermissao({
				userId: req.session.me,
				insertPath: '/formapagamento/create',
				deletePath: '/formapagamento/delete',
				editPath: '/formapagamento/edit'
			}, function (resultPermissao) {
				return res.view('crud.ejs', {
					fields: [
						{
							titulo: 'Descrição',
							nome: 'descricao'
						}
					],
					records: formasPagamento,
					options: {
						insert: 'Nova Forma de Pagamento',
						insertURL: '/formapagamento/create',
						updateURL: '/formapagamento/edit',
						deleteURL: '/formapagamento/delete',
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
		FormaPagamento.destroy({id: req.body.id}).exec(function (err) {
			if (err) {
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200});
		});
	},
	edit: function(req, res) {
		Moeda.find().exec(function (err, moedas) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			Conta.find().exec(function (err, contas) {
				if (err) {
					console.log(JSON.stringify(err));
					return res.send(JSON.stringify(err));
				}
				FormaPagamento.find({id: req.param('id')}).populate(['conta', 'moeda']).exec(function (err, formasPagamento) {
					if (err) {
						console.log(JSON.stringify(err));
						return res.send(JSON.stringify(err));
					}
					return res.view('formaPagamento/edit.ejs', {formaPagamento: formasPagamento[0], contas: contas, moedas: moedas});
				});
			});
		});		
	},
	create: function (req, res) {
		return res.view('formaPagamento/create.ejs');
	},
	editPost: function (req, res) {
		FormaPagamento.update({id: req.body.id}, req.body.formaPagamento).exec(function (err, formaPagamentoDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200, formaPagamento: formaPagamentoDB});
		});
	},
	createPost: function (req, res) {
		//validate(req.body, function (produto) {
		FormaPagamento.create(req.body.formaPagamento).exec(function (err, formaPagamentoDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}

			return res.send({statusCode: 200, formaPagamento: formaPagamentoDB});
		});
	}
};

