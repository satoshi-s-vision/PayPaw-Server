let BillsCtrl = require('../../controllers/v1_0/bills_controller.js');
const helper = require('../../tools/helper_method');
const request = require('request');

module.exports = function(app) {
  // get bills
  // app.get('/api/v1/bills', BillsCtrl.getAllBills);
  app.get('/api/v1/bills', isLoggedIn, BillsCtrl.getAllBills);

  // post one bill
  app.post('/api/v1/bill', getNewAddress, BillsCtrl.postBill);

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

  /**
   * Get new address for checkout
   * @param {obj} req Request
   * @param {obj} res Response
   * @param {obj} next continue
   * @return {obj} next
   */
  function getNewAddress(req, res, next) {
    let startTime = new Date();
    request('http://www.google.com', function (error, response, body) {

      let endTime = new Date();
      let seconds = (endTime.getTime() - startTime.getTime()) / 1000;

      console.log('Time cost for getting new address ', seconds);

      if (response && response.statusCode == 200) {
        // body.new_address
        res.locals.newAddress = 'bm1qzrqd2ra5qh9xf7wsdk22c06dn9xkjjec0krp0p';
        return next();
      } else {
        // display error?
        helper.errResp(res, 400, 'Error: bad request, check your payload or URL!');
      }
    });
  }
};
