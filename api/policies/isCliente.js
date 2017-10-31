module.exports = function(req, res, next) {
  if (req.session.me) {
    //checar se user é cliente

    User.findOne({id: req.session.me}, function (err, user) {
      if (err || typeof user == 'undefined') {
        return res.redirect('/unauthorized');
      }

      if (typeof user.cliente == 'undefined' || user.cliente < 0) {
        return res.redirect('/unauthorized');
      }
      return next();
    });
  }

  if (req.wantsJSON) {
    return res.send(401);
  }

  return res.redirect('/unauthorized');
};