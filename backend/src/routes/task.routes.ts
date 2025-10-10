import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { taskValidator } from '../validators/task.validator';
import { TaskNotificationService } from '../services/TaskNotificationService';
import { NotificationService } from '../services/notification/NotificationService';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { NotificationHandler } from '../websocket/NotificationHandler';
import { ConnectionManager } from '../websocket/ConnectionManager';
import { EmailService } from '../services/email/EmailService';

const router = Router();

// Initialize services
const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);
const notificationHandler = (global as any).notificationHandler;
const connectionManager = (global as any).connectionManager;
const emailService = (global as any).emailService;

// Initialize TaskNotificationService
const taskNotificationService = new TaskNotificationService(
  notificationService,
  notificationHandler,
  connectionManager,
  emailService
);

const taskController = new TaskController(taskNotificationService);

// Apply authentication to all routes
router.use(authMiddleware);

// Create task
router.post(
  '/',
  validationMiddleware(taskValidator.createTask),
  taskController.createTask
);

// Get all tasks (with optional projectId and status filters)
router.get('/', taskController.getTasks);

// Get tasks by project
router.get('/project/:projectId', taskController.getTasksByProject);

// Get task by ID
router.get('/:id', taskController.getTaskById);

// Update task
router.put(
  '/:id',
  validationMiddleware(taskValidator.updateTask),
  taskController.updateTask
);

// Delete task
router.delete('/:id', taskController.deleteTask);

export { router as taskRoutes };
