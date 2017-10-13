/**
 * VendaController
 *
 * @description :: Server-side logic for managing Vendas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {
	create: function (req, res) {
		Loja.find().exec(function (err, lojas) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			TabelaPreco.find().exec(function (err, tabelas) {
				if (err) {
					console.log(JSON.stringify(err));
					return res.send(JSON.stringify(err));
				}
				Produto.find().populate('precos').exec(function (err, produtos) {
					if (err) {
						console.log(JSON.stringify(err));
						return res.send(JSON.stringify(err));
					}

					for (var i = produtos.length - 1; i >= 0; i--) {
						produtos[i].updateCampos();
					}

					FormaPagamento.find().exec(function (err, formasPagamento) {
						return res.view({produtos: produtos, formasPagamento: formasPagamento, tabelas: tabelas,
							vendedor: {
								nome: 'Vendedor 1'
							},
							cliente: {
								nome: 'Balcão'
							},
							lojas: lojas});
					});
				});
			});
		});

		


		
	}
};

