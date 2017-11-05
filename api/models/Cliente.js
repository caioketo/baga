/**
 * Cliente.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
		nome :{
			type: 'string'
		},
		rut: {
			type: 'string'
		},
		email: {
			type: 'string'
		},
		tabelaPreco: {
			model: 'TabelaPreco'
		}
  },
  getDefault: function (done) {
  	if (sails.config.baga.clienteId && sails.config.baga.clienteId.length > 0) {
		this.findOne({id: sails.config.baga.clienteId}).exec(function (err, cliente) {
			if (err) {
				console.log(JSON.stringify(err));
				return done({
					nome: 'Balcão'
				});
			}
			return done(cliente);
		});			
	}
	else {
		return done({
			nome: 'Balcão'
		});
	}
  }
};

