/* eslint-disable new-cap */
module.exports = function(sequelize, DataTypes) {
  const Messages = sequelize.define('Messages', {
    id: { autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.TEXT },
    palindrome: { type: DataTypes.BOOLEAN, allowNull: true },
    status: { type: DataTypes.INTEGER(2), defaultValue: 1 },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }
  }, {
    charset: 'utf8mb4',
    timestamps: true
  });

  Messages.associate = function(models) {
    models.Messages.belongsTo(models.User, {
      foreignKey: 'user_id',
    });
  };

  return Messages;
};
