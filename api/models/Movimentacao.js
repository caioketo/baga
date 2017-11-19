/**
 * Movimentacao.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	numero: {
		type: 'integer',
		autoIncrement: true
	},
	estoqueEntrada: {
		model: 'estoque'
	},
	estoqueSaida: {
		model: 'estoque'
	},
	descricao: {
		type: 'string'
	},
	items: {
		collection: 'itemmovimentacao',
		via: 'movimentacao'
	}
  },
  beforeCreate: function(obj, next) {
    Movimentacao.find().max('numero').exec(function (err, movimentacoes) {
      if (err) {
        console.log(err);
        next(err);
      }
      let movimentacao = movimentacoes[0];
      if (!movimentacao || !movimentacao.numero) {
        obj['numero'] = 1;
      }
      else {
        obj['numero'] = movimentacao.numero + 1;
      }
      next(null);
    });
  }
};

