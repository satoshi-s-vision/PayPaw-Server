'use strict';

const models = require('../../models');
const helper = require('../../tools/helper_method');


/**
 * Get Bills (option: search terms)
 *
 * @param {object} req The request
 * @param {object} res The response
 */
exports.getAllBills = function(req, res) {
  const Bills = models.Bills;

  // Can easily add search param in the future
  // requested filter
  const reqq = req.query || {};
  // applied filter
  const rqq = {};

  // Search term
  rqq.limit = reqq.limit !== undefined &&
                Number.isInteger(+reqq.limit) &&
                +reqq.limit > -1 ? +reqq.limit : 1000;

  rqq.order = reqq.order !== undefined &&
                ['ASC', 'DESC'].indexOf(reqq.order.toUpperCase()) > -1
    ? reqq.order.toUpperCase() : 'ASC';

  rqq.offset = reqq.offset !== undefined &&
                Number.isInteger(+reqq.offset) &&
                +reqq.offset > -1 ? +reqq.offset : 0;

  // TODO - rate limit (DDOS)
  Bills.findAll({
    offset: rqq.offset,
    limit: rqq.limit,
    order: [
      ['id', rqq.order],
    ],
    attributes: [
      'id',
      'user_id',
      'email',
      'currency',
      'currency_amount',
      'address',
      'asset_id',
      'asset_amount',
      'status',
      'created_at',
      'updated_at',
      'User.recipient_name',
      'User.recipient_wallet_address'
    ],
    where: {
      user_id: req.user.id,
    },
    include: [{
      model: models.User,
      attributes: ['recipient_name', 'recipient_wallet_address'],
    }],
  }).then( (resData) => {
    // OK
    helper.okResp(res, 200, 'ok', resData, rqq);
  }).catch( (err) => {
    console.log(err);
    // Error
    helper.errResp(res, 404, 'Error: Can not get Bills!');
  });
};


/**
 * Post one bill
 *
 * @param {object} req The request
 * @param {object} res The response
 */
exports.postBill = function(req, res) {
  const Bills = models.Bills;

  if (req.body && req.body.data) {

    const bill = req.body.data
    const DEFAULT = {
      asset_id: 1,
      asset_amount: bill.currency_amount,
      address: 'bm1qzrqd2ra5qh9xf7wsdk22c06dn9xkjjec0krp0p', // TODO call service to get a new address
      status: 0
    }

    Bills.create({
      user_id: bill.user_id,
      email: bill.email,
      currency: bill.currency,
      currency_amount: bill.currency_amount,
      message: bill.message,
      address: DEFAULT.address,
      asset_id: DEFAULT.asset_id,
      asset_amount: DEFAULT.asset_amount,
      status: DEFAULT.status,
    }).then( (data) => {
      // OK, created
      setTimeout(function () {
        helper.okResp(res, 201, 'Created', data);
      }, 500);
    }).catch( (err) => {
      console.log(err);
      // Error
      helper.errResp(res, 404, 'Error: Can not post your bill!');
    });
  } else {
    helper.errResp(res, 400,
      'Error: bad request, check your payload or URL!');
  }
};

/**
 * Post one bill
 *
 * @param {object} req The request
 * @param {object} res The response
 */
exports.getPostBill = function(req, res) {
    // Can easily add search param in the future
  // requested filter
  const reqq = req.query || {};

  const Bills = models.Bills;

  if (reqq) {
    const bill = reqq
    const DEFAULT = {
      asset_id: 1,
      asset_amount: bill.currency_amount,
      address: 'pending',
      status: 0
    }

    Bills.create({
      user_id: bill.user_id,
      email: bill.email,
      currency: bill.currency,
      currency_amount: bill.currency_amount,
      message: bill.message,
      address: DEFAULT.address,
      asset_id: DEFAULT.asset_id,
      asset_amount: DEFAULT.asset_amount,
      status: DEFAULT.status,
    }).then( (data) => {
      // OK, created
      helper.okResp(res, 201, 'Created', data);
    }).catch( (err) => {
      console.log(err);
      // Error
      helper.errResp(res, 404, 'Error: Can not post your bill!');
    });
  } else {
    helper.errResp(res, 400,
      'Error: bad request, check your payload or URL!');
  }
};
