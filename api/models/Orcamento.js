/**
 * Orcamento.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	itens: {
		collection: 'OrcamentoItem',
  			via: 'orcamento'
  		},
  		cliente: {
  			model: 'Cliente'
  		},
  		vendedor: {
  			model: 'Vendedor'
  		},
      	total: {
        	type: 'float'
      	},
      	cancelado: {
	        type: 'boolean',
	        defaultsTo: false
      	},
      	numero: {
	        type: 'integer',
	        autoIncrement: true
      	},
      	desconto: {
	        type: 'float'
      	}
  },
  beforeCreate: function(obj, next) {
    Orcamento.find().max('numero').exec(function (err, vendas) {
      if (err) {
        console.log(err);
        next(err);
      }
      let venda = vendas[0];
      if (!venda || !venda.numero) {
        obj['numero'] = 1;
      }
      else {
        obj['numero'] = venda.numero + 1;
      }
      next(null);
    });
  }
};

