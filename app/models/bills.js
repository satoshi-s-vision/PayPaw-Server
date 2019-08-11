/* eslint-disable new-cap */
module.exports = function(sequelize, DataTypes) {
  const Bills = sequelize.define('Bills', {
    id: { autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER(11) },
    user_id: { type: DataTypes.INTEGER(11), allowNull: false },
    email: { type: DataTypes.STRING(64), allowNull: false, validate: {isEmail: true} },
    currency: { type: DataTypes.STRING(64), allowNull: false },
    currency_amount: { type: DataTypes.DECIMAL(20,8), allowNull: false },
    address: { type: DataTypes.STRING(64), allowNull: false },
    asset_id: { type: DataTypes.INTEGER(11), allowNull: false },
    asset_amount: { type: DataTypes.DECIMAL(20,8), allowNull: false },
    message: { type: DataTypes.STRING(1024), allowNull: true },
    status: { type: DataTypes.INTEGER(1), allowNull: false },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE }
  }, {
    charset: 'utf8mb4',
    timestamps: false
  });

  Bills.associate = function(models) {
    models.Bills.belongsTo(models.User, {
      foreignKey: 'user_id',
    });
  };

  return Bills;
};
