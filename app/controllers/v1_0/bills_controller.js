'use strict';

const models = require('../../models');
const helper = require('../../tools/helper_method');
const Sequelize = require('sequelize')

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
      'message',
      'updated_at',
      [
        Sequelize.literal(`TIME_TO_SEC(TIMEDIFF(NOW(), Bills.created_at))`),
        'bill_age'
      ],
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
    // Error
    helper.errResp(res, 404, 'Error: Can not get Bills!');
  });
};

/**
 * Get one bill
 *
 * @param {object} req The request
 * @param {object} res The response
 */
exports.getOneBill = function(req, res) {
  const Bills = models.Bills;

  let bill_id = req.params.id;

  if (!bill_id) {
    helper.errResp(res, 400, 'Error: bad request, check your payload or URL!');
    return
  }

  Bills.findOne({
    where: {
      id: bill_id,
    },
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
      'message',
      'updated_at',
      [
        Sequelize.literal(`TIME_TO_SEC(TIMEDIFF(NOW(), Bills.created_at))`),
        'bill_age'
      ]
    ]
  }).then( (resData) => {
    // OK
    helper.okResp(res, 200, 'ok', resData, { bill_id: bill_id });
  }).catch( (err) => {
    helper.errResp(res, 404, 'Error: Can not get bill');
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

  function setBillAsPaid(bill_id) {
    Bills.update({
      status: 1,
    }, {
      where: { id: bill_id }
    });
  }

  if (req.body && req.body.data && res.locals.newAddress) {

    const bill = req.body.data
    const DEFAULT = {
      asset_id: 1,
      asset_amount: bill.currency_amount,
      address: res.locals.newAddress, // TODO call service to get a new address
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

      // TODO - remove - mock payment
      setTimeout(function () {
        setBillAsPaid(data.id);
      }, 3000);

    }).catch( (err) => {
      // Error
      helper.errResp(res, 404, 'Error: Can not post your bill!');
    });
  } else {
    helper.errResp(res, 400,
      'Error: bad request, check your payload or URL!');
  }
};
