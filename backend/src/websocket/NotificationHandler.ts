import { Server as SocketIOServer, Socket } from 'socket.io';
import { logger } from '../utils/logger';

export class NotificationHandler {
  private io: SocketIOServer;

  constructor(io: SocketIOServer) {
    this.io = io;
  }

  async handleMarkAsRead(socket: Socket, notificationId: string): Promise<void> {
    try {
      const notificationService = (global as any).notificationService;
      
      if (notificationService) {
        const notification = await notificationService.markAsRead(notificationId);
        
        if (notification) {
          // Emit confirmation back to the client
          socket.emit('notification_read', {
            notificationId,
            readAt: notification.readAt,
          });

          // Broadcast to other clients in the same room (if needed)
          socket.broadcast.emit('notification_read', {
            notificationId,
            readAt: notification.readAt,
          });
        }
      }
    } catch (error) {
      logger.error('Failed to handle mark as read', {
        error: error instanceof Error ? error.message : 'Unknown error',
        socketId: socket.id,
        notificationId,
      });
      
      // Emit error back to client
      socket.emit('error', {
        message: 'Failed to mark notification as read',
        notificationId,
      });
    }
  }

  async sendNotification(socket: Socket, notification: any): Promise<void> {
    try {
      socket.emit('notification', {
        id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        createdAt: notification.createdAt,
        metadata: notification.metadata,
      });
    } catch (error) {
      logger.error('Failed to send notification via WebSocket', {
        error: error instanceof Error ? error.message : 'Unknown error',
        socketId: socket.id,
        notificationId: notification._id,
      });
    }
  }

  async sendNotificationToRoom(room: string, notification: any): Promise<void> {
    try {
      this.io.to(room).emit('notification', {
        id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        createdAt: notification.createdAt,
        metadata: notification.metadata,
      });
    } catch (error) {
      logger.error('Failed to send notification to room', {
        error: error instanceof Error ? error.message : 'Unknown error',
        room,
        notificationId: notification._id,
      });
    }
  }

  async sendNotificationToUser(userId: string, notification: any): Promise<void> {
    try {
      console.log('Sending notification to user:', { userId, notificationId: notification._id });
      console.log('Notification data:', {
        id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
      });
      
      this.io.to(`user:${userId}`).emit('notification', {
        id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        createdAt: notification.createdAt,
        metadata: notification.metadata,
      });
      
      console.log('Notification sent successfully to user:', userId);
    } catch (error) {
      logger.error('Failed to send notification to user', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
        notificationId: notification._id,
      });
    }
  }

  async broadcastNotification(notification: any): Promise<void> {
    try {
      this.io.emit('notification', {
        id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        createdAt: notification.createdAt,
        metadata: notification.metadata,
      });
    } catch (error) {
      logger.error('Failed to broadcast notification', {
        error: error instanceof Error ? error.message : 'Unknown error',
        notificationId: notification._id,
      });
    }
  }
}
