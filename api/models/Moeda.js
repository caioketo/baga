/**
 * Moeda.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	descricao: {
  		type: 'string'
  	},
  	simbolo: {
  		type: 'string'
  	},
  	moedaSite: {
  		type: 'string'
  	}
  },
  getMoedasSite: function () {
    return ['Peso Uruguaio', 'Dólar', 'Peso Argentino', 'Real', 'Euro'];
  }
};

