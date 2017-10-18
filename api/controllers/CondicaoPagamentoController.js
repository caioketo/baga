/**
 * CondicaoPagamentoController
 *
 * @description :: Server-side logic for managing Condicaopagamentoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function (req, res) {
		CondicaoPagamento.find().exec(function (err, condicoesPagamento) {
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
				records: condicoesPagamento,
				options: {
					insert: 'Nova Condição de Pagamento',
					insertURL: '/condicaopagamento/create',
					updateURL: '/condicaopagamento/edit',
					deleteURL: '/condicaopagamento/delete'
				}
			});
		});
	},
	delete: function (req, res) {
		CondicaoPagamento.destroy({id: req.body.id}).exec(function (err) {
			if (err) {
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200});
		});
	},
	edit: function(req, res) {
		FormaPagamento.find().exec(function (err, formasPagamento) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			CondicaoPagamento.find({id: req.param('id')}).populate('formaPagamento').exec(function (err, condicoesPagamento) {
				if (err) {
					console.log(JSON.stringify(err));
					return res.send(JSON.stringify(err));
				}
				return res.view('condicaopagamento/edit.ejs', {condicaoPagamento: condicoesPagamento[0], 
					formasPagamento: formasPagamento});
			});
		});				
	},
	create: function (req, res) {
		return res.view('condicaopagamento/create.ejs');
	},
	editPost: function (req, res) {
		CondicaoPagamento.update({id: req.body.id}, req.body.condicaoPagamento).exec(function (err, condicaoPagamentoDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.send({statusCode: 200, condicaoPagamento: condicaoPagamentoDB});
		});
	},
	createPost: function (req, res) {
		CondicaoPagamento.create(req.body.condicaoPagamento).exec(function (err, condicaoPagamentoDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}

			return res.send({statusCode: 200, condicaoPagamento: condicaoPagamentoDB});
		});
	}
};

