// models/Menu.js
module.exports = (sequelize, DataTypes) => {
  const Menu = sequelize.define('Menu', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.INTEGER, allowNull: false },
    imageUrl: { type: DataTypes.STRING },
  });
  Menu.associate = (models) => {
    Menu.hasMany(models.OrderItem, { foreignKey: 'menuId' });
  };
  return Menu;
};
