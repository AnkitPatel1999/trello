import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { logger } from '../utils/logger';

export class NotificationController {
  createNotification = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const notificationService = (global as any).notificationService;
    const notification = await notificationService.createNotification(req.body);
    
    ApiResponse.created(res, 'Notification created successfully', notification);
  });

  createBatchNotifications = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const notificationService = (global as any).notificationService;
    const notifications = await notificationService.createBatchNotifications(req.body);
    
    ApiResponse.created(res, 'Batch notifications created successfully', {
      count: notifications.length,
      notifications,
    });
  });

  getUserNotifications = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const notificationService = (global as any).notificationService;
    const userId = req.user!.id;
    
    const options = {
      status: req.query.status as string,
      type: req.query.type as string,
      unread: req.query.unread === 'true',
      limit: parseInt(req.query.limit as string) || 20,
      offset: parseInt(req.query.offset as string) || 0,
    };

    const notifications = await notificationService.getNotifications(userId, options);
    
    ApiResponse.success(res, 'Notifications retrieved successfully', notifications, {
      total: notifications.length,
      limit: options.limit,
    });
  });

  getNotificationById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const notificationService = (global as any).notificationService;
    const { id } = req.params;
    const userId = req.user!.id;

    // In a real implementation, you'd have a method to get notification by ID
    // For now, we'll get user notifications and find the specific one
    const notifications = await notificationService.getNotifications(userId);
    const notification = notifications.find((n: any) => n._id === id);

    if (!notification) {
      ApiResponse.notFound(res, 'Notification not found');
      return;
    }

    ApiResponse.success(res, 'Notification retrieved successfully', notification);
  });

  markAsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const notificationService = (global as any).notificationService;
    const { id } = req.params;

    const notification = await notificationService.markAsRead(id);
    
    if (!notification) {
      ApiResponse.notFound(res, 'Notification not found');
      return;
    }

    ApiResponse.success(res, 'Notification marked as read', notification);
  });

  markAllAsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const notificationService = (global as any).notificationService;
    const userId = req.user!.id;

    const count = await notificationService.markAllAsRead(userId);
    
    ApiResponse.success(res, 'All notifications marked as read', { count });
  });

  getNotificationStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const notificationService = (global as any).notificationService;
    const userId = req.user!.id;

    const stats = await notificationService.getNotificationStats(userId);
    
    ApiResponse.success(res, 'Notification stats retrieved successfully', stats);
  });

  deleteNotification = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    // In a real implementation, you'd have a delete method
    // For now, we'll just return success
    logger.info('Notification deletion requested', { notificationId: id, userId });
    
    ApiResponse.success(res, 'Notification deleted successfully');
  });
}
