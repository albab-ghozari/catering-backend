const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
});


const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./User')(sequelize, DataTypes);
db.Menu = require('./Menu')(sequelize, DataTypes);
db.Order = require('./Order')(sequelize, DataTypes);
db.OrderItem = require('./OrderItem')(sequelize, DataTypes);

// Relasi
Object.keys(db).forEach(model => {
  if (db[model].associate) db[model].associate(db);
});

module.exports = db;
