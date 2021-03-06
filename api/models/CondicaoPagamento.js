/**
 * CondicaoPagamento.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  		formaPagamento: {
  			model: 'FormaPagamento'
  		},
      aVista: {
        type: 'boolean'
      },
      intervalo: {
        type: 'integer'
      },
  		parcelas: {
  			type: 'integer'
  		},
  		primeiraParcela: {
  			type: 'integer'
  		},
  		descricao: {
  			type: 'string'
  		}
  }
};

