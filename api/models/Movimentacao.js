/**
 * Movimentacao.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	numero: {
		type: 'integer',
		autoIncrement: true
	},
	estoqueEntrada: {
		model: 'estoque'
	},
	estoqueSaida: {
		model: 'estoque'
	},
	descricao: {
		type: 'string'
	},
	items: {
		collection: 'itemmovimentacao',
		via: 'movimentacao'
	},
	observacao: {
		type: 'string'
	},
	insertItems: function (items, cb) {
		let _movimentacao = this;
		items.forEach(function (item, index) {
	  		item.movimentacao = _movimentacao.id;;
            if (typeof _movimentacao.estoqueSaida !== 'undefined') {
  			   Produto.updateEstoque(_movimentacao.estoqueSaida, item.produto, parseInt(item.quantidade * -1));
            }
            if (typeof _movimentacao.estoqueEntrada !== 'undefined') {
  			   Produto.updateEstoque(_movimentacao.estoqueEntrada, item.produto, parseInt(item.quantidade));
            }
  			if (index == items.length - 1 && cb) {
  				cb();
  			}
	  	});
	},
	estornarItems: function (cb) {
		let _movimentacao = this;
		_movimentacao.items.forEach(function (item, index) {
  			Produto.updateEstoque(_movimentacao.estoqueSaida, item.produto, (item.quantidade * -1));
  			Produto.updateEstoque(_movimentacao.estoqueEntrada, item.produto, parseInt(item.quantidade));
  			ItemMovimentacao.destroy({id: item.id}).exec(function (err) {
  				if (err) {
  					console.log(JSON.stringify(err));
  				}
  			});
  			if (index == _movimentacao.items.length - 1 && cb) {
  				cb();
  			}
	  	});
	}
  },
  beforeCreate: function(obj, next) {
    Movimentacao.find().max('numero').exec(function (err, movimentacoes) {
      if (err) {
        console.log(err);
        next(err);
      }
      let movimentacao = movimentacoes[0];
      if (!movimentacao || !movimentacao.numero) {
        obj['numero'] = 1;
      }
      else {
        obj['numero'] = movimentacao.numero + 1;
      }
      next(null);
    });
  }
};

