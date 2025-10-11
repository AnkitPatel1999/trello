import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { logger } from '../utils/logger';
import { Task } from '../models/Task.model';
import { Project } from '../models/Project.model';
import { User } from '../models/User.model';
import { generateId } from '../utils/helpers';
import { TaskNotificationService } from '../services/TaskNotificationService';

export class TaskController {
  private taskNotificationService: TaskNotificationService;

  constructor(taskNotificationService: TaskNotificationService) {
    this.taskNotificationService = taskNotificationService;
  }
  createTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { title, description, subtitles, status, projectId } = req.body;
    const userId = req.user!.id;

    try {
      // Remove user ownership check - allow creating tasks in any project
      const project = await Project.findOne({ _id: projectId, isActive: true });
      if (!project) {
        ApiResponse.badRequest(res, 'Project not found');
        return;
      }

      const task = await Task.create({
        title,
        description,
        subtitles: subtitles || [],
        status: status || 'proposed',
        projectId,
        userId,
      });

      // Get user information for the creator
      const user = await User.findById(userId).select('name email');
      const createdBy = user?.name || user?.email || 'Unknown';

      logger.info('Task created', { taskId: task._id, userId, projectId, title });

      ApiResponse.created(res, 'Task created successfully', {
        id: task._id,
        title: task.title,
        description: task.description,
        subtitles: task.subtitles,
        status: task.status,
        projectId: task.projectId,
        createdBy,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      });
    } catch (error) {
      logger.error('Failed to create task', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
        projectId,
        title,
      });
      ApiResponse.internalServerError(res, 'Failed to create task');
    }
  });

  getTasks = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { projectId, status } = req.query;

    try {
      const filter: any = {}; // Remove userId filter
      
      if (projectId) {
        // Remove user ownership check - allow access to any project
        const project = await Project.findOne({ _id: projectId, isActive: true });
        if (!project) {
          ApiResponse.badRequest(res, 'Project not found');
          return;
        }
        filter.projectId = projectId;
      }

      if (status) {
        filter.status = status;
      }

      const tasks = await Task.find(filter)
        .sort({ createdAt: -1 })
        .select('_id title description subtitles status projectId userId createdAt updatedAt');

      // Get user information for each task
      const userIds = [...new Set(tasks.map(task => task.userId))];
      const users = await User.find({ _id: { $in: userIds } }).select('_id name email');
      const userMap = new Map(users.map(user => [user._id.toString(), user]));

      const formattedTasks = tasks.map(task => {
        const creator = userMap.get(task.userId);
        return {
          id: task._id,
          title: task.title,
          description: task.description,
          subtitles: task.subtitles,
          status: task.status,
          projectId: task.projectId,
          createdBy: creator?.name || creator?.email || 'Unknown',
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        };
      });

      ApiResponse.success(res, 'Tasks retrieved successfully', formattedTasks);
    } catch (error) {
      logger.error('Failed to get tasks', {
        error: error instanceof Error ? error.message : 'Unknown error',
        projectId,
        status,
      });
      ApiResponse.internalServerError(res, 'Failed to retrieve tasks');
    }
  });

  getTaskById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    try {
      // Remove user ownership check
      const task = await Task.findById(id);
      if (!task) {
        ApiResponse.notFound(res, 'Task not found');
        return;
      }

      ApiResponse.success(res, 'Task retrieved successfully', {
        id: task._id,
        title: task.title,
        description: task.description,
        subtitles: task.subtitles,
        status: task.status,
        projectId: task.projectId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      });
    } catch (error) {
      logger.error('Failed to get task', {
        error: error instanceof Error ? error.message : 'Unknown error',
        taskId: id,
      });
      ApiResponse.internalServerError(res, 'Failed to retrieve task');
    }
  });

  updateTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { title, description, subtitles, status } = req.body;
    const userId = req.user!.id;

    try {
      // Remove user ownership check - allow any user to update any task
      const currentTask = await Task.findById(id);
      if (!currentTask) {
        ApiResponse.notFound(res, 'Task not found');
        return;
      }

      const oldStatus = currentTask.status;
      const updateData: any = { updatedAt: new Date() };
      
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (subtitles !== undefined) updateData.subtitles = subtitles;
      if (status !== undefined) updateData.status = status;

      const task = await Task.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      if (!task) {
        ApiResponse.notFound(res, 'Task not found');
        return;
      }

      // Send notifications if status changed
      if (status !== undefined && status !== oldStatus && id) {
        try {
          await this.taskNotificationService.notifyTaskMoved(
            id,
            userId,
            oldStatus,
            status
          );
        } catch (notificationError) {
          logger.error('Failed to send task move notifications1', {
            error: notificationError instanceof Error ? notificationError.message : 'Unknown error',
            taskId: id,
            userId,
            fromStatus: oldStatus,
            toStatus: status,
          });
          // Don't fail the request if notifications fail
        }
      }

      logger.info('Task updated', { taskId: id, userId, title: task.title });

      ApiResponse.success(res, 'Task updated successfully', {
        id: task._id,
        title: task.title,
        description: task.description,
        subtitles: task.subtitles,
        status: task.status,
        projectId: task.projectId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      });
    } catch (error) {
      logger.error('Failed to update task', {
        error: error instanceof Error ? error.message : 'Unknown error',
        taskId: id,
        userId,
      });
      ApiResponse.internalServerError(res, 'Failed to update task');
    }
  });

  deleteTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    try {
      const task = await Task.findOneAndDelete({ _id: id, userId });

      if (!task) {
        ApiResponse.notFound(res, 'Task not found');
        return;
      }

      logger.info('Task deleted', { taskId: id, userId });

      ApiResponse.success(res, 'Task deleted successfully');
    } catch (error) {
      logger.error('Failed to delete task', {
        error: error instanceof Error ? error.message : 'Unknown error',
        taskId: id,
        userId,
      });
      ApiResponse.internalServerError(res, 'Failed to delete task');
    }
  });

  getTasksByProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { projectId } = req.params;
    const userId = req.user!.id;

    try {
      // Verify project belongs to user
      const project = await Project.findOne({ _id: projectId, userId, isActive: true });
      if (!project) {
        ApiResponse.badRequest(res, 'Project not found or access denied');
        return;
      }

      const tasks = await Task.find({ projectId, userId })
        .sort({ createdAt: -1 })
        .select('_id title description subtitles status projectId userId createdAt updatedAt');

      // Get user information for each task
      const userIds = [...new Set(tasks.map(task => task.userId))];
      const users = await User.find({ _id: { $in: userIds } }).select('_id name email');
      const userMap = new Map(users.map(user => [user._id.toString(), user]));

      const formattedTasks = tasks.map(task => {
        const creator = userMap.get(task.userId);
        return {
          id: task._id,
          title: task.title,
          description: task.description,
          subtitles: task.subtitles,
          status: task.status,
          projectId: task.projectId,
          createdBy: creator?.name || creator?.email || 'Unknown',
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        };
      });

      ApiResponse.success(res, 'Project tasks retrieved successfully', formattedTasks);
    } catch (error) {
      logger.error('Failed to get project tasks', {
        error: error instanceof Error ? error.message : 'Unknown error',
        projectId,
        userId,
      });
      ApiResponse.internalServerError(res, 'Failed to retrieve project tasks');
    }
  });
}
