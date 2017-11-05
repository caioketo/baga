/**
 * Vendedor.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  		nome: {
  			type: 'string'
  		}
  },
  getDefault: function (options, done) {
  	let vendedorDefault = undefined;
  	if (sails.config.baga.vendedorId && sails.config.baga.vendedorId.length > 0) {
  		vendedorDefault = sails.config.baga.vendedorId
  	}
  	if (options.userId && options.userId !== '8428e8d3667f3deb63184a4c1109c13aafed55c4') {
		User.findOne({id: options.userId}).populate('vendedor').exec(function (err, user) {
			if (!err && user && user.vendedor) {
				return done(user.vendedor);
			}
			Vendedor.findOne({id: vendedorDefault}).exec(function (err, vendedor) {
				if (!err && vendedor) {
					return done(vendedor);
				}
			});
		});
	}
	else {
		Vendedor.findOne({id: vendedorDefault}).exec(function (err, vendedor) {
			if (!err && vendedor) {
				return done(vendedor);
			}
		});
	}
  }
};

