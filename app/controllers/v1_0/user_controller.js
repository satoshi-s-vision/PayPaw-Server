'use strict';

const models = require('../../models');
const helper = require('../../tools/helper_method');

/**
 * Get user profile
 *
 * @param {object} req The request
 * @param {object} res The response
 */
exports.getMe = function(req, res) {
  const User = models.User;

  let user_id = req.user && req.user.id;

  if (!user_id) {
    helper.errResp(res, 400, 'Error: bad request, user id missing');
    return
  }

  User.findOne({
    where: {
      id: user_id,
    },
    attributes: [
      'id',
      'email',
      'first_name',
      'last_name',
      'access_token',
      'recipient_name',
      'recipient_wallet_address',
      'phone',
      'created_at',
      'updated_at'
    ]
  }).then( (resData) => {
    // OK
    helper.okResp(res, 200, 'ok', resData, { user_id: user_id });
  }).catch( (err) => {
    helper.errResp(res, 404, 'Error: Can not get user');
  });
};
