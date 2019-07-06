let BillsCtrl = require('../../controllers/v1_0/bills_controller.js');
const helper = require('../../tools/helper_method');


module.exports = function(app) {
  // get messages
  // app.get('/api/v1/bills', BillsCtrl.getAllBills);
  app.get('/api/v1/bills', isLoggedIn, BillsCtrl.getAllBills);

  // post one message
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
      helper.okResp(res, 401, 'Unauthorized: login is required');
    }
  }
};
