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

  constructor() {
    this.app = express();
    this.initializeServices();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private initializeServices(): void {
    // Initialize repositories
    const notificationRepository = new NotificationRepository();

    // Initialize services
    const notificationService = new NotificationService(notificationRepository);

    // Make services available globally
    (global as any).notificationService = notificationService;
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

  async start(): Promise<void> {
    try {
      // Connect to database
      await connectDatabase();

      // Start server
      this.app.listen(config.port, () => {
        console.log(`Server started on port ${config.port}`);
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
