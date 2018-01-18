/**
 * ItemPromocao.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	produto: {
  		model: 'produto'
  	},
  	quantidade: {
  		type: 'float'
  	},
  	promocao: {
  		model: 'promocao'
  	}
  }
};

