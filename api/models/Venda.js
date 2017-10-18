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
      }
  }
};

