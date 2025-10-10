import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDatabase } from './config';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { routes } from './routes';
import { NotificationService } from './services/notification/NotificationService';
import { NotificationRepository } from './repositories/NotificationRepository';
import { NotificationHandler } from './websocket/NotificationHandler';
import { ConnectionManager } from './websocket/ConnectionManager';
import { EmailService } from './services/email/EmailService';
import { Server as SocketIOServer } from 'socket.io';
import { createServer } from 'http';
// Simple config using environment variables
const config = {
  port: parseInt(process.env.PORT || '3001'),
  apiVersion: process.env.API_VERSION || 'v1',
};


// Import models to ensure they are registered with mongoose
import './models/Auth.model';
import './models/Project.model';
import './models/Task.model';

class NotificationServer {
  private app: express.Application;
  private server: any;
  private io: SocketIOServer;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    this.initializeServices();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
    this.setupWebSocket();
  }

  private initializeServices(): void {
    // Initialize repositories
    const notificationRepository = new NotificationRepository();

    // Initialize services
    const notificationService = new NotificationService(notificationRepository);
    const notificationHandler = new NotificationHandler(this.io);
    const connectionManager = new ConnectionManager(this.io);
    const emailService = new EmailService();

    // Make services available globally
    (global as any).notificationService = notificationService;
    (global as any).notificationHandler = notificationHandler;
    (global as any).connectionManager = connectionManager;
    (global as any).emailService = emailService;
  }

  private setupMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS middleware
    this.app.use(cors({
      origin: '*',
      credentials: true,
    }));

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      });
    });

    // API routes
    this.app.use(`/api/${config.apiVersion}`, routes);

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: 'Route not found',
      });
    });
  }

  private setupErrorHandling(): void {
    this.app.use(errorHandler);
  }

  private setupWebSocket(): void {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      console.log('Socket handshake:', socket.handshake.headers);

      // Handle user authentication and join
      socket.on('join', async (data: { userId: string }) => {
        try {
          console.log('User join request:', data);
          const connectionManager = (global as any).connectionManager;
          if (connectionManager) {
            await connectionManager.handleUserJoin(socket, data.userId);
            console.log('User successfully joined:', data.userId);
          } else {
            console.error('ConnectionManager not available');
          }
        } catch (error) {
          console.error('Failed to handle user join:', error);
        }
      });

      // Handle mark notification as read
      socket.on('mark_notification_read', async (data: { notificationId: string }) => {
        try {
          const notificationHandler = (global as any).notificationHandler;
          if (notificationHandler) {
            await notificationHandler.handleMarkAsRead(socket, data.notificationId);
          }
        } catch (error) {
          console.error('Failed to mark notification as read:', error);
        }
      });

      // Handle disconnect
      socket.on('disconnect', async (reason) => {
        try {
          const connectionManager = (global as any).connectionManager;
          if (connectionManager) {
            await connectionManager.handleDisconnect(socket, reason);
          }
        } catch (error) {
          console.error('Failed to handle disconnect:', error);
        }
      });
    });
  }

  async start(): Promise<void> {
    try {
      // Connect to database
      await connectDatabase();

      // Start server
      this.server.listen(config.port, () => {
        console.log(`Server started on port ${config.port}`);
        console.log(`WebSocket server ready`);
      });

      // Setup graceful shutdown
      this.setupGracefulShutdown();

    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      console.log(`Received ${signal}, shutting down gracefully...`);
      
      try {
        console.log('Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }
}

// Start server
const server = new NotificationServer();
server.start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
