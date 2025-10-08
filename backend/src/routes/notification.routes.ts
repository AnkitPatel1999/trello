import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { notificationValidator } from '../validators/notification.validator';

const router = Router();
const notificationController = new NotificationController();

// Apply authentication to all routes
router.use(authMiddleware);

// Create notification
router.post(
  '/',
  validationMiddleware(notificationValidator.createNotification),
  notificationController.createNotification
);

// Create batch notifications
router.post(
  '/batch',
  validationMiddleware(notificationValidator.createBatchNotifications),
  notificationController.createBatchNotifications
);

// Get user notifications
router.get('/', notificationController.getUserNotifications);

// Get notification by ID
router.get('/:id', notificationController.getNotificationById);

// Mark notification as read
router.patch('/:id/read', notificationController.markAsRead);

// Mark all notifications as read
router.patch('/read-all', notificationController.markAllAsRead);

// Get notification stats
router.get('/stats/summary', notificationController.getNotificationStats);

// Delete notification
router.delete('/:id', notificationController.deleteNotification);

export { router as notificationRoutes };
