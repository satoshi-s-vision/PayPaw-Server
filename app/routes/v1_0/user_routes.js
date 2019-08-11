let UserCtrl = require('../../controllers/v1_0/user_controller.js');

module.exports = function(app) {

  app.get('/api/v1/user/me', isLoggedIn, UserCtrl.getMe);

  /**
   * Check if user logged in.
   * @param {obj} req Request
   * @param {obj} res Response
   * @param {obj} next continue
   * @return {obj} next
   */
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      return res.redirect('/login');
    }
  }

};
