/**
 * Promocao.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 
	TODO: adicionar isPromocao no produto, pegar qtde possivel qtde de cada item / qtde usada na promo
 */

module.exports = {

  attributes: {
  	produto: {
  		model: 'produto'
  	},
  	itens: {
  		collection: 'ItemPromocao',
  		via: 'promocao'
  	}
  }
};

