/**
 * DashboardController
 *
 * @description :: Server-side logic for managing Dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	dashboard: function (req, res) {
		if (req.session.me == '8428e8d3667f3deb63184a4c1109c13aafed55c4') {
			return res.view('dashboard', {dashboard: 
				{
					produto: true,
					categoria: true,
					cliente: true,
					fornecedor: true,
					formaPagamento: true,
					condicaoPagamento: true,
					vendedor: true,
					tabelaPreco: true,
					conta: true,
					moeda: true,
					loja: true,
					permissao: true,
					grupopermissao: true,
					user: true
				},
				layout: false});
		}
		PermissaoService.getDashboardPermissoes({userId: req.session.me}, function (err, permissoes) {
			if (err) {
				console.log(JSON.stringify(err));
				return res.send(JSON.stringify(err));
			}
			return res.view('dashboard', {dashboard: permissoes, layout: false});
		});
	},
	teste: function (req, res) {
		return res.view('.\\venda\\modalDesconto');
	}
};

