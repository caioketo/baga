/**
 * Produto.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
		codigo: {
			type: 'string'
		},
		descricao: {
			type: 'string'
		},
		custo: {
			type: 'float'
		},
    precos: {
      collection: 'Preco',
      via: 'produto'
    },
    categoria: {
      model: 'categoria'
    },
    estoques: {
      collection: 'produtoquantidade',
      via: 'produto'
    },
    fornecedor: {
      model: 'fornecedor'
    }
  }
};

