/**
 * Venda.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  		itens: {
  			collection: 'ItemVenda',
  			via: 'venda'
  		},
  		pagamentos: {
  			collection: 'PagamentoVenda',
  			via: 'venda'
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
      cancelada: {
        type: 'boolean',
        defaultsTo: false
      },
      numero: {
        type: 'integer',
        autoIncrement: true
      },
      desconto: {
        type: 'float'
      },
      abertura: {
        model: 'abertura'
      },
      impresso: {
        type: 'integer'
      }
  },
  beforeCreate: function(obj, next) {
    Venda.find().max('numero').exec(function (err, vendas) {
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

