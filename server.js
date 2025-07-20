const http = require('http');
const app = require('./app');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: "*" } });
const db = require('./models');

db.sequelize.sync({ alter: true })
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Failed to sync database:', err));

require('./sockets/orderSocket')(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
