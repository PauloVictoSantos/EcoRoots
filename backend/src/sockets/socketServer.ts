import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { config } from '../config';
import { logger } from '../utils/logger';

let io: SocketIOServer | null = null;

export const initSocketServer = (httpServer: HttpServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: config.cors.origins,
      methods: ['GET', 'POST'],
    },
    pingTimeout: 30000,
    pingInterval: 10000,
  });

  io.on('connection', (socket: Socket) => {
    logger.info('Client connected: %s (total: %d)', socket.id, io!.engine.clientsCount);

    socket.emit('greenhouse:welcome', {
      message: 'Connected to Smart Greenhouse real-time feed',
      ts: new Date().toISOString(),
    });

    socket.on('disconnect', (reason) => {
      logger.info('Client disconnected: %s (%s)', socket.id, reason);
    });

    socket.on('request:dashboard', async () => {
      // Client can request latest data on demand
      socket.emit('greenhouse:ping', { ts: new Date().toISOString() });
    });
  });

  logger.info('Socket.IO server initialized');
  return io;
};

export const getSocketServer = (): SocketIOServer | null => io;
