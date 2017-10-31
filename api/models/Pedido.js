/**
 * Venda.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
	itens: {
		collection: 'ItemPedido',
		via: 'pedido'
	},
	cliente: {
		model: 'Cliente'
	},
	total: {
		type: 'float'
	},
	//CRIAR STATUS PEDIDO
	// 0- Criado
	// 1- Visualizado
	// 2- Confirmado
	// 3- Cancelado
	// 4- Finalizado
	status: {
		type: 'integer'
	},
	numero: {
		type: 'integer',
		autoIncrement: true
	}
  }
};

