module.exports = function(req, res, next) {
	if (req.session.me) {
		if (req.session.me == '8428e8d3667f3deb63184a4c1109c13aafed55c4') {
			return next();
		}
		let _path = req.path;
		if (_path.indexOf('Post') !== -1) {
			_path = _path.substring(0, _path.indexOf('Post'));
			console.log(_path);
		}
		PermissaoService.hasPermissao({
			req: req,
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