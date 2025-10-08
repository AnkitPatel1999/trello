import { Server as SocketIOServer, Socket } from 'socket.io';
import { logger } from '../utils/logger';
import { NotificationHandler } from './NotificationHandler';
import { ConnectionManager } from './ConnectionManager';

export class WebSocketServer {
  private io: SocketIOServer;
  private notificationHandler: NotificationHandler;
  private connectionManager: ConnectionManager;

  constructor(io: SocketIOServer) {
    this.io = io;
    this.notificationHandler = new NotificationHandler(io);
    this.connectionManager = new ConnectionManager(io);
  }

  initialize(): void {
    this.io.on('connection', (socket: Socket) => {
      logger.info('New WebSocket connection', { socketId: socket.id });

      // Handle user joining their notification room
      socket.on('join', async (data: { userId: string }) => {
        try {
          await this.connectionManager.handleUserJoin(socket, data.userId);
          logger.info('User joined notification room', { 
            socketId: socket.id, 
            userId: data.userId 
          });
        } catch (error) {
          logger.error('Failed to handle user join', {
            error: error instanceof Error ? error.message : 'Unknown error',
            socketId: socket.id,
            userId: data.userId,
          });
        }
      });

      // Handle user leaving their notification room
      socket.on('leave', async (data: { userId: string }) => {
        try {
          await this.connectionManager.handleUserLeave(socket, data.userId);
          logger.info('User left notification room', { 
            socketId: socket.id, 
            userId: data.userId 
          });
        } catch (error) {
          logger.error('Failed to handle user leave', {
            error: error instanceof Error ? error.message : 'Unknown error',
            socketId: socket.id,
            userId: data.userId,
          });
        }
      });

      // Handle marking notification as read
      socket.on('mark_read', async (data: { notificationId: string }) => {
        try {
          await this.notificationHandler.handleMarkAsRead(socket, data.notificationId);
          logger.info('Notification marked as read via WebSocket', { 
            socketId: socket.id, 
            notificationId: data.notificationId 
          });
        } catch (error) {
          logger.error('Failed to handle mark as read', {
            error: error instanceof Error ? error.message : 'Unknown error',
            socketId: socket.id,
            notificationId: data.notificationId,
          });
        }
      });

      // Handle user activity updates
      socket.on('user_activity', async (data: { userId: string, isOnline: boolean }) => {
        try {
          await this.connectionManager.handleUserActivity(socket, data.userId, data.isOnline);
          logger.info('User activity updated via WebSocket', { 
            socketId: socket.id, 
            userId: data.userId,
            isOnline: data.isOnline
          });
        } catch (error) {
          logger.error('Failed to handle user activity', {
            error: error instanceof Error ? error.message : 'Unknown error',
            socketId: socket.id,
            userId: data.userId,
          });
        }
      });

      // Handle disconnection
      socket.on('disconnect', async (reason: string) => {
        try {
          await this.connectionManager.handleDisconnect(socket, reason);
          logger.info('WebSocket disconnected', { 
            socketId: socket.id, 
            reason 
          });
        } catch (error) {
          logger.error('Failed to handle disconnect', {
            error: error instanceof Error ? error.message : 'Unknown error',
            socketId: socket.id,
            reason,
          });
        }
      });

      // Handle errors
      socket.on('error', (error: Error) => {
        logger.error('WebSocket error', {
          error: error.message,
          socketId: socket.id,
        });
      });
    });

    logger.info('WebSocket server initialized');
  }

  // Method to send notification to specific user
  async sendNotificationToUser(userId: string, notification: any): Promise<void> {
    try {
      this.io.to(`user:${userId}`).emit('notification', notification);
      logger.info('Notification sent via WebSocket', { userId, notificationId: notification._id });
    } catch (error) {
      logger.error('Failed to send notification via WebSocket', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
        notificationId: notification._id,
      });
    }
  }

  // Method to broadcast to all connected users
  broadcast(event: string, data: any): void {
    this.io.emit(event, data);
    logger.info('Broadcast sent via WebSocket', { event });
  }

  // Method to get connected users count
  getConnectedUsersCount(): number {
    return this.io.engine.clientsCount;
  }

  // Method to get active rooms
  getActiveRooms(): string[] {
    return Array.from(this.io.sockets.adapter.rooms.keys());
  }
}
