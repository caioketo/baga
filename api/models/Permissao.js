/**
 * Permissao.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	path: {
  		type: 'string'
  	},
    nome: {
      type: 'string'
    },
    grupos: {
      collection: 'grupopermissao',
      via: 'permissoes'
    }
  }
};

