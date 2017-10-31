module.exports = function(req, res, next) {
	if (req.session.me) {
		console.log(req.path);
		PermissaoService.hasPermissao({
			userId: req.session.me,
			path: req.path
		}, function (authorized) {
			if (!authorized) {
				if (req.wantsJSON) {
					return res.send(401);
				}
				return res.redirect('/unauthorized');
			}
			return next();
		});
	}
	else {
		if (req.wantsJSON) {
			return res.send(401);
		}

		return res.redirect('/unauthorized');
	}
};