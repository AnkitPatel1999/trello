import { Server as SocketIOServer, Socket } from 'socket.io';
import { logger } from '../utils/logger';

export class ConnectionManager {
  private io: SocketIOServer;
  private userSockets: Map<string, Set<string>> = new Map(); // userId -> Set of socketIds

  constructor(io: SocketIOServer) {
    this.io = io;
  }

  async handleUserJoin(socket: Socket, userId: string): Promise<void> {
    try {
      console.log('Handling user join:', { userId, socketId: socket.id });
      
      // Join user-specific room
      await socket.join(`user:${userId}`);
      console.log('User joined room:', `user:${userId}`);
      
      // Track user socket
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(socket.id);
      console.log('User sockets updated:', this.userSockets.get(userId)?.size);

      // Store userId in socket data
      (socket as any).userId = userId;

      // Update user activity
      const userActivityService = (global as any).userActivityService;
      if (userActivityService) {
        await userActivityService.setUserOnline(userId, socket.id, {
          userAgent: socket.handshake.headers['user-agent'] || 'Unknown',
          platform: 'Unknown',
          browser: 'Unknown',
          deviceType: 'desktop',
        });
      }

      logger.info('User joined room', { userId, socketId: socket.id });
    } catch (error) {
      logger.error('Failed to handle user join', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
        socketId: socket.id,
      });
    }
  }

  async handleUserLeave(socket: Socket, userId: string): Promise<void> {
    try {
      // Leave user-specific room
      await socket.leave(`user:${userId}`);
      
      // Remove socket from tracking
      const userSockets = this.userSockets.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          this.userSockets.delete(userId);
        }
      }

      logger.info('User left room', { userId, socketId: socket.id });
    } catch (error) {
      logger.error('Failed to handle user leave', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
        socketId: socket.id,
      });
    }
  }

  async handleUserActivity(socket: Socket, userId: string, isOnline: boolean): Promise<void> {
    try {
      const userActivityService = (global as any).userActivityService;
      if (userActivityService) {
        await userActivityService.updateUserActivity({
          userId,
          isOnline,
          lastSeen: new Date(),
        });
      }

      // Broadcast user activity to other users in the same room
      socket.broadcast.to(`user:${userId}`).emit('user_activity', {
        userId,
        isOnline,
        lastSeen: new Date(),
      });

      logger.info('User activity updated', { userId, isOnline, socketId: socket.id });
    } catch (error) {
      logger.error('Failed to handle user activity', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
        isOnline,
        socketId: socket.id,
      });
    }
  }

  async handleDisconnect(socket: Socket, reason: string): Promise<void> {
    try {
      const userId = (socket as any).userId;
      
      if (userId) {
        // Remove socket from tracking
        const userSockets = this.userSockets.get(userId);
        if (userSockets) {
          userSockets.delete(socket.id);
          if (userSockets.size === 0) {
            this.userSockets.delete(userId);
            
            // Set user offline if no more active sockets
            const userActivityService = (global as any).userActivityService;
            if (userActivityService) {
              await userActivityService.setUserOffline(userId, socket.id);
            }
          }
        }

        // Leave user room
        await socket.leave(`user:${userId}`);
      }

      logger.info('Socket disconnected', { 
        socketId: socket.id, 
        userId, 
        reason,
        remainingSockets: this.userSockets.size 
      });
    } catch (error) {
      logger.error('Failed to handle disconnect', {
        error: error instanceof Error ? error.message : 'Unknown error',
        socketId: socket.id,
        reason,
      });
    }
  }

  getUserSockets(userId: string): Set<string> {
    return this.userSockets.get(userId) || new Set();
  }

  isUserOnline(userId: string): boolean {
    console.log('isUserOnline called with userId:', userId);
    console.log('Current userSockets map:', Array.from(this.userSockets.entries()));
    const sockets = this.userSockets.get(userId);
    console.log('Sockets for user:', sockets);
    const isOnline = sockets ? sockets.size > 0 : false;
    console.log('isOnline result:', isOnline);
    return isOnline;
  }

  getOnlineUsers(): string[] {
    return Array.from(this.userSockets.keys());
  }

  getTotalConnections(): number {
    let total = 0;
    for (const sockets of this.userSockets.values()) {
      total += sockets.size;
    }
    return total;
  }
}
