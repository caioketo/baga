module.exports = {
	getAbertura: function (done) {
		Abertura.find({fechamento: null}).sort('createdAt DESC').limit(1).exec(function (err, aberturas) {
			if (err) {
				return done(err);
			}
			let abertura = aberturas[0];
			if (abertura && abertura.createdAt) {
				let dataAbertura = new Date(abertura.createdAt);
				let mesAbertura = dataAbertura.getUTCMonth() + 1;
				let diaAbertura = dataAbertura.getUTCDate();
				let anoAbertura = dataAbertura.getUTCFullYear();
				let mesAgora = new Date().getUTCMonth() + 1;
				let diaAgora = new Date().getUTCDate();
				let anoAgora = new Date().getUTCFullYear();

				if (mesAgora == mesAbertura && diaAgora == diaAbertura && anoAgora == anoAbertura) {
					return done(null, abertura);
				}
				else {
					return done(null, undefined);
				}
			}
			else {
				return done(null, undefined);
			}
		});
	}
}