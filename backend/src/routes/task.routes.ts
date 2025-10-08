import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { taskValidator } from '../validators/task.validator';

const router = Router();
const taskController = new TaskController();

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
