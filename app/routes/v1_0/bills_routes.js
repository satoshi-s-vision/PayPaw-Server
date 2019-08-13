let BillsCtrl = require('../../controllers/v1_0/bills_controller.js');

module.exports = function(app) {
  // get bills
  // app.get('/api/v1/bills', BillsCtrl.getAllBills);
  app.get('/api/v1/bills', isLoggedIn, BillsCtrl.getAllBills);

  // app.get('/api/v1/bills', BillsCtrl.getAllBills);
  app.get('/api/v1/bill/:id', BillsCtrl.getOneBill);

  // post one bill
  app.post('/api/v1/bill', BillsCtrl.postBill);

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
