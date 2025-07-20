// models/Order.js
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    eventDate: { type: DataTypes.DATEONLY, allowNull: false },
    totalPrice: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'canceled', 'done'),
      defaultValue: 'pending',
    },
    notes: { type: DataTypes.TEXT },
  });
  Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: 'userId' });
    Order.hasMany(models.OrderItem, { foreignKey: 'orderId' });
  };
  return Order;
};
