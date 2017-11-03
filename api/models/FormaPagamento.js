/**
 * FormaPagamento.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	  attributes: {
		descricao: {
			type: 'string'
		},
		moeda: {
			model: 'Moeda'
		},
		conta: {
			model: 'Conta'
		},
		condicoesPagamento: {
			collection: 'CondicaoPagamento',
			via: 'formaPagamento'
		}
	  },
	getCotacaoMoedas: function (formasPagamento, done) {
		CotacaoService.getCotacao(function (moedasCotacao) {
			formasPagamento.forEach(function (_formaPagamento, index) {
				_formaPagamento.cotacao = 1;
				let _moedaSite = _formaPagamento.moeda.moedaSite;
				if (_moedaSite) {
					moedasCotacao.forEach(function (moedaCot, index) {
						if (_moedaSite == moedaCot.moeda) {
							_formaPagamento.cotacao = parseFloat(moedaCot.compra.replace(',', '.'));
						}
					});
				}
			});

			return done(formasPagamento);
		});
	}
};

