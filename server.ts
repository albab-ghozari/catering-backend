import http from 'http';
import app from './app';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Buat HTTP server dari Express app
const server = http.createServer(app);

// Inisialisasi Socket.io
const io = new SocketIOServer(server, {
  cors: {
    origin: "*"
  }
});

// Import dan jalankan socket handler
import orderSocket from './sockets/orderSocket';
orderSocket(io);

// Jalankan server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
