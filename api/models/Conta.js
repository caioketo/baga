/**
 * Conta.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	descricao: {
  		type: 'string'
  	},
	/*
		0- Caixa
		1- Conta à Receber 
		2- Conta à Pagar
		3- Conta Corrente
	*/
  	tipo: {
  		type: 'integer'
  	},
    tipoDesc: function () {
      switch (this.tipo) {
        case 0: return 'Caixa';
        case 1: return 'Conta à Receber';
        case 2: return 'Conta à Pagar';
        case 3: return 'Conta Corrente';
      }
    }
  }
};

