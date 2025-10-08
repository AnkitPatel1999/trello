import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { logger } from '../utils/logger';

export class UserSessionController {
  updateUserActivity = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userActivityService = (global as any).userActivityService;
    const userId = req.user!.id;

    const activityData = {
      userId,
      ...req.body,
      lastSeen: req.body.lastSeen ? new Date(req.body.lastSeen) : new Date(),
    };

    await userActivityService.updateUserActivity(activityData);
    
    ApiResponse.success(res, 'User activity updated successfully');
  });

  getUserSessions = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    
    // In a real implementation, you'd get user sessions from the repository
    // For now, we'll return a mock response
    const sessions = [
      {
        id: 'session1',
        deviceInfo: {
          userAgent: 'Mozilla/5.0...',
          platform: 'Windows',
          browser: 'Chrome',
          deviceType: 'desktop',
        },
        connectedAt: new Date(),
        lastActivity: new Date(),
        isActive: true,
      },
    ];
    
    ApiResponse.success(res, 'User sessions retrieved successfully', sessions);
  });

  getActiveUsers = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userActivityService = (global as any).userActivityService;
    
    const activeUsers = await userActivityService.getActiveUsers();
    
    ApiResponse.success(res, 'Active users retrieved successfully', {
      count: activeUsers.length,
      users: activeUsers,
    });
  });

  updateUserPreferences = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userPreferenceService = (global as any).userPreferenceService;
    const userId = req.user!.id;

    const preferences = await userPreferenceService.updateUserPreferences(userId, req.body);
    
    ApiResponse.success(res, 'User preferences updated successfully', preferences);
  });

  getUserPreferences = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userPreferenceService = (global as any).userPreferenceService;
    const userId = req.user!.id;

    const preferences = await userPreferenceService.getUserPreferences(userId);
    
    ApiResponse.success(res, 'User preferences retrieved successfully', preferences);
  });
}
