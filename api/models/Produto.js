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
		},
		fiscal: {
			type: 'integer'
		},
		quantidadeTotal: function() {
			if (typeof this.estoques == 'undefined' && this.estoques.length <= 0 && typeof this.estoques[0].id == 'undefined') {
				return 0;
			}
			else {
				let total = 0;
				for (let i = 0; i < this.estoques.length; i++) {
					if (typeof this.estoques[i].quantidade !== 'undefined') {
						total += parseInt(this.estoques[i].quantidade);
					}
				}
				return total;
			}
		}
	},
	updateEstoque: function (estoque, produto, quantidade) {
		Produto.findOne({id: produto}).populate('estoques').exec(function (err, _produto) {
			if (!err) {
				for (let i = 0; i < _produto.estoques.length; i++) {
					if (_produto.estoques[i].estoque == estoque) {
						let prodQtde = _produto.estoques[i];
						prodQtde.quantidade += quantidade;
						prodQtde.save(function (err) {
							if (err) {
								console.log(err);
							}
						});
					}
				}
			}
		});
	}
};

