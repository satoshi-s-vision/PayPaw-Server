/* eslint-disable new-cap */
module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    id: {autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    email: { type: DataTypes.STRING, allowNull: false, validate: {isEmail: true} },
    access_token: {type: DataTypes.STRING, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    first_name: {type: DataTypes.STRING, allowNull: false},
    last_name: {type: DataTypes.STRING, allowNull: false},
    recipient_name: {type: DataTypes.STRING, allowNull: false},
    recipient_wallet_address: {type: DataTypes.STRING, allowNull: false},
    phone: {type: DataTypes.STRING, allowNull: true},
    // created_at: { type: DataTypes.DATE, allowNull: false },
    // updated_at: { type: DataTypes.DATE, allowNull: false }

    // last_login: {type: DataTypes.DATE},
    // status: {type: DataTypes.INTEGER(2), defaultValue: 1},
  }, {
    charset: 'utf8mb4'
  })

  User.associate = function(models) {
    User.hasMany(models.Messages, {foreignKey: 'user_id'});
  };

  return User
};
