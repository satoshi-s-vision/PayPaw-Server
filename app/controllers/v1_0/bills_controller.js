'use strict';

const models = require('../../models');
const helper = require('../../tools/helper_method');
const Sequelize = require('sequelize');
const request = require('request');

/**
 * Get Bills (option: search terms)
 *
 * @param {object} req The request
 * @param {object} res The response
 */
exports.getAllBills = function(req, res) {
  const Bills = models.bills;

  // Search param in the future
  // requested filter
  // TODO - validation, check duplicate...
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
        Sequelize.literal(`TIME_TO_SEC(TIMEDIFF(NOW(), bills.created_at))`),
        'bill_age'
      ],
      'user.recipient_name',
      'user.recipient_wallet_address'
    ],
    where: {
      user_id: req.user.id,
    },
    include: [{
      model: models.user,
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
  const Bills = models.bills;

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
        Sequelize.literal(`TIME_TO_SEC(TIMEDIFF(NOW(), bills.created_at))`),
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
  const Bills = models.bills;

  function _getNewAddressReturnBill(bill_id, rs) {
    // For testing - use google.com
    // request('http://www.google.com', function (error, response, body) {
    request(`http://0.0.0.0:8080/api/set-address/${bill_id}`, function (error, response, body) {
      if (response && response.statusCode == 200) {
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
              Sequelize.literal(`TIME_TO_SEC(TIMEDIFF(NOW(), bills.created_at))`),
              'bill_age'
            ]
          ]
        }).then( (resData) => {
          // OK
          helper.okResp(rs, 200, 'ok', resData, { bill_id: bill_id });
        }).catch( (err) => {
          helper.errResp(rs, 404, 'Error: Can not get bill');
        });
      } else {
        // display error?
        helper.errResp(rs, 400, 'Error: bad request, something goes wrong!');
      }
    });
  }

  if (req.body && req.body.data) {
    const bill = req.body.data
    const DEFAULT = {
      asset_id: 1,
      asset_amount: bill.currency_amount / 10**8,
      status: 0
    }

    Bills.create({
      user_id: bill.user_id,
      email: bill.email,
      currency: bill.currency,
      currency_amount: bill.currency_amount,
      message: bill.message,
      asset_id: DEFAULT.asset_id,
      asset_amount: DEFAULT.asset_amount,
      status: DEFAULT.status,
    }).then( (data) => {
      // OK, created, get new address and return
      _getNewAddressReturnBill(data.id, res);
    }).catch( (err) => {
      // Error
      helper.errResp(res, 404, 'Error: Can not post your bill!');
    });
  } else {
    helper.errResp(res, 400,
      'Error: bad request, check your payload or URL!');
  }
};
