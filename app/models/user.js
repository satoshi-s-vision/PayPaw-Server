/* eslint-disable new-cap */
module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    id: {autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    email: { type: DataTypes.STRING(64), allowNull: false, validate: {isEmail: true} },
    password: {type: DataTypes.STRING(64), allowNull: false},
    access_token: {type: DataTypes.STRING(36), allowNull: false},
    first_name: {type: DataTypes.STRING(64), allowNull: false},
    last_name: {type: DataTypes.STRING(64), allowNull: false},
    recipient_name: {type: DataTypes.STRING(64), allowNull: false},
    recipient_wallet_address: {type: DataTypes.STRING(64), allowNull: false},
    phone: {type: DataTypes.STRING(64), allowNull: true}
  }, {
    charset: 'utf8mb4'
  })

  User.associate = function(models) {
    User.hasMany(models.Messages, {foreignKey: 'user_id'});
  };

  User.associate = function(models) {
    User.hasMany(models.Bills, {foreignKey: 'user_id'});
  };

  return User
};
