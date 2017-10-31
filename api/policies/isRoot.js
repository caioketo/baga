module.exports = function(req, res, next) {
	if (req.session.me && req.session.me == '8428e8d3667f3deb63184a4c1109c13aafed55c4') {
		return next();
	}
	else {
		if (req.wantsJSON) {
			return res.send(401);
		}

		return res.redirect('/unauthorized');
	}
};