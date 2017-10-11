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
  		quantidade: {
  			type: 'float'
  		},
  		custo: {
  			type: 'float'
  		},
  		venda: {
  			type: 'float'
  		},
      precos: {
        collection: 'Preco',
        via: 'produto'
      },
      categoria: {
        model: 'Categoria'
      },
      updateCampos: function () {
        for (var i = 0; i < this.precos.length; i++) {
          if (this.precos[i].tabelaNome) {
            this[this.precos[i].tabelaNome] = this.precos[i].valor;
          }
          else {
            this.precos[i].tabelaNome(this, i, function (produto, i, nome) {
              produto[nome] = produto.precos[i].valor;
            });
          }
        }
      }
  }
};

