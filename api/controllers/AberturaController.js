/**
 * AberturaController
 *
 * @description :: Server-side logic for managing Aberturas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	abrirCaixa: function (req, res) {
		return res.view();
	},
	abrirCaixaPost: function (req, res) {
		Abertura.create(req.body.abertura).exec(function (err, aberturaDB) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}

			return res.send({statusCode: 200});
		});
	}
};

