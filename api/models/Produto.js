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
      updateCampos: function (cb) {
        let maxI = this.precos.length - 1;
        for (var i = 0; i < this.precos.length; i++) {
          this.precos[i].tabelaNome(this, i, function (produto, _i, nome) {
            produto[nome] = produto.precos[_i].valor;
            //console.log(produto.toJSON());
            console.log(_i);
            if (_i == maxI && cb) {
              cb();
            }
          });
        }
      }
  }
};

