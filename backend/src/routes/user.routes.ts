import { Router } from 'express';
import { UserSessionController } from '../controllers/UserSessionController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { userValidator } from '../validators/user.validator';

const router = Router();
const userSessionController = new UserSessionController();

// Apply authentication to all routes
router.use(authMiddleware);

// Update user activity
router.post(
  '/activity',
  validationMiddleware(userValidator.updateActivity),
  userSessionController.updateUserActivity
);

// Get user sessions
router.get('/sessions', userSessionController.getUserSessions);

// Get active users
router.get('/active', userSessionController.getActiveUsers);

// Update user preferences
router.put(
  '/preferences',
  validationMiddleware(userValidator.updatePreferences),
  userSessionController.updateUserPreferences
);

// Get user preferences
router.get('/preferences', userSessionController.getUserPreferences);

export { router as userRoutes };
