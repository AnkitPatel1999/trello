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

// Initialize TaskNotificationService and TaskController lazily
let taskNotificationService: TaskNotificationService;
let taskController: TaskController;

const initializeTaskController = () => {
  if (!taskNotificationService) {
    const notificationHandler = (global as any).notificationHandler;
    const connectionManager = (global as any).connectionManager;
    const emailService = (global as any).emailService;

    if (!notificationHandler || !connectionManager || !emailService) {
      throw new Error('Required services not initialized');
    }

    taskNotificationService = new TaskNotificationService(
      notificationService,
      notificationHandler,
      connectionManager,
      emailService
    );

    taskController = new TaskController(taskNotificationService);
  }
  return taskController;
};

// Apply authentication to all routes
router.use(authMiddleware);

// Create task
router.post(
  '/',
  validationMiddleware(taskValidator.createTask),
  (req, res, next) => initializeTaskController().createTask(req, res, next)
);

// Get all tasks (with optional projectId and status filters)
router.get('/', (req, res, next) => initializeTaskController().getTasks(req, res, next));

// Get tasks by project
router.get('/project/:projectId', (req, res, next) => initializeTaskController().getTasksByProject(req, res, next));

// Get task by ID
router.get('/:id', (req, res, next) => initializeTaskController().getTaskById(req, res, next));

// Update task
router.put(
  '/:id',
  validationMiddleware(taskValidator.updateTask),
  (req, res, next) => initializeTaskController().updateTask(req, res, next)
);

// Delete task
router.delete('/:id', (req, res, next) => initializeTaskController().deleteTask(req, res, next));

export { router as taskRoutes };
