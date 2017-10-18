/**
 * ItemVenda.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  		venda: {
  			model: 'Venda'
  		},
  		produto: {
  			model: 'Produto'
  		},
  		quantidade: {
  			type: 'float'
  		},
  		custo: {
  			type: 'float'
  		},
  		preco: {
  			type: 'float'
  		},
      loja: {
        model: 'Loja'
      },
      tabelaPreco: {
        model: 'TabelaPreco'
      }
  }
};

