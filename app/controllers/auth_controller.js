'use strict';


module.exports.signup = function(req, res) {
  res.render(
    'pages/signup',
    {
      message: req.flash('signupMessage'),
    }
  );
};

module.exports.login = function(req, res) {
  res.render(
    'pages/login',
    {
      message: req.flash('loginMessage'),
    }
  );
};

module.exports.dashboard = function(req, res) {
  if (!req.user) return res.redirect('/login');
  res.render('pages/dashboard', {
    user: req.user,
  });
};

module.exports.logout = function(req, res) {
  req.session.destroy(function(err) {
    res.redirect('/');
  });
};
