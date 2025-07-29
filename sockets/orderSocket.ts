import { Server, Socket } from 'socket.io';

export default function orderSocket(io: Server): void {
  io.on('connection', (socket: Socket) => {
    console.log('🔌 Socket connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected:', socket.id);
    });
  });
}
