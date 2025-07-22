module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    orderId: DataTypes.INTEGER,
    menuId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    subTotal: DataTypes.INTEGER
  });

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });
    OrderItem.belongsTo(models.Menu, { foreignKey: 'menuId' });
  };

  return OrderItem;
};
