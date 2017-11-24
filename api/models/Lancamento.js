/**
 * Lancamento.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
	  data: {
  		type: 'datetime'
  	},
  	vencimento: {
  		type: 'datetime'
  	},
  	conta: {
  		model: 'Conta'
  	},
  	descricao: {
  		type: 'string'
  	},
  	moeda: {
  		model: 'Moeda'
  	},
  	cliente: {
  		model: 'Cliente'
  	},
  	pago: {
  		type: 'boolean',
  		defaultsTo: false
  	},
  	fornecedor: {
  		model: 'Fornecedor'
  	},
    valor: {
      type: 'float'
    },
    venda: {
      model: 'Venda'
    },
    abertura: {
      model: 'abertura'
    }
  }
};

