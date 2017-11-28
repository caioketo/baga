/**
 * AberturaController
 *
 * @description :: Server-side logic for managing Aberturas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	abrirCaixa: function (req, res) {
		return res.view();
	},
	abrirCaixaPost: function (req, res) {
		Abertura.create(req.body.abertura).exec(function (err, aberturaDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}

			return res.send({statusCode: 200});
		});
	},
	fecharCaixa: function (req, res) {
		FormaPagamento.find().exec(function (err, formasPagamento) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.view({formasPagamento: formasPagamento});
		});
	},
	fecharCaixaPost: function (req, res) {
		CaixaService.getAbertura(function (err, abertura) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}

			if (abertura) {
				Fechamento.create(req.body.fechamento).exec(function (err, fechamento) {
					if (err) {
						console.log(JSON.stringify(err));
						return res.send(JSON.stringify(err));
					}
					abertura.fechamento = fechamento.id;
					Abertura.update({ id: abertura.id }, { fechamento: fechamento.id }).exec(function (err) {
						if (err) {
							console.log(JSON.stringify(err));
							return res.send(JSON.stringify(err));
						}
						console.log(JSON.stringify(abertura));
						return res.send({statusCode: 200});
					});
				});
			}
		});
	}
};

