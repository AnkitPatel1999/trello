import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { projectValidator } from '../validators/project.validator';

const router = Router();
const projectController = new ProjectController();

// Apply authentication to all routes
router.use(authMiddleware);

// Create project
router.post(
  '/',
  validationMiddleware(projectValidator.createProject),
  projectController.createProject
);

// Get all projects
router.get('/', projectController.getProjects);

// Get project by ID
router.get('/:id', projectController.getProjectById);

// Update project
router.put(
  '/:id',
  validationMiddleware(projectValidator.updateProject),
  projectController.updateProject
);

// Delete project
router.delete('/:id', projectController.deleteProject);

export { router as projectRoutes };
