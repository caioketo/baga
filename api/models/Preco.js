/**
 * Preco.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	valor: {
  		type: 'float'
  	},
  	produto: {
  		model: 'produto'
  	},
  	tabelaPreco: {
  		model: 'tabelaPreco'
  	},
    tabelaNome: function (produto, i, cb) {
      TabelaPreco.findOne({id: this.tabelaPreco}).exec(function (err, tabela) {
        if (err) {
          return "";
        }
        cb(produto, i, tabela.descricao);
      });
      return "";
    }
  }
};

