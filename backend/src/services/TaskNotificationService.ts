import { NotificationService } from './notification/NotificationService';
import { NotificationHandler } from '../websocket/NotificationHandler';
import { ConnectionManager } from '../websocket/ConnectionManager';
import { EmailService } from './email/EmailService';
import { User } from '../models/User.model';
import { Task } from '../models/Task.model';
import { Project } from '../models/Project.model';
import { logger } from '../utils/logger';
import { NotificationType } from '../enums/NotificationType.enum';
import { DeliveryChannel } from '../enums/DeliveryChannel.enum';

export class TaskNotificationService {
  private notificationService: NotificationService;
  private notificationHandler: NotificationHandler;
  private connectionManager: ConnectionManager;
  private emailService: EmailService;

  constructor(
    notificationService: NotificationService,
    notificationHandler: NotificationHandler,
    connectionManager: ConnectionManager,
    emailService: EmailService
  ) {
    this.notificationService = notificationService;
    this.notificationHandler = notificationHandler;
    this.connectionManager = connectionManager;
    this.emailService = emailService;
  }

  async notifyTaskMoved(
    taskId: string,
    movedByUserId: string,
    fromStatus: string,
    toStatus: string
  ): Promise<void> {
    try {
      // Get task details
      const task = await Task.findById(taskId).populate('userId', 'name email');
      if (!task) {
        logger.error('Task not found for notification', { taskId });
        return;
      }

      // Get project details
      const project = await Project.findById(task.projectId);
      if (!project) {
        logger.error('Project not found for notification', { projectId: task.projectId });
        return;
      }

      // Get mover details
      const mover = await User.findById(movedByUserId);
      if (!mover) {
        logger.error('Mover not found for notification', { movedByUserId });
        return;
      }

      // Get all users in the project (assuming project has collaborators)
      // For now, we'll get all users - you can modify this based on your project structure
      const allUsers = await User.find({});

      console.log('allUsers', allUsers);
      
      const notificationTitle = 'Task Moved';
      const notificationMessage = `${mover.name} moved task "${task.title}" from ${fromStatus} to ${toStatus}`;
      console.log('notificationTitle', notificationTitle);
      console.log('notificationMessage', notificationMessage);
      // Process notifications for each user
      for (const user of allUsers) {
        // Skip the user who moved the task
        console.log('user', user._id.toString());
        console.log('movedByUserId', movedByUserId);
        if (user._id.toString() === movedByUserId) {
          continue;
        }
        console.log('isOnline 1 ');
        console.log('connectionManager:', this.connectionManager);
        console.log('connectionManager.isUserOnline:', typeof this.connectionManager.isUserOnline);

        const isOnline = this.connectionManager.isUserOnline(user._id.toString());
        console.log('isOnline', isOnline);
        if (isOnline) {
          // Create notification record first
          const notificationRecord = await this.notificationService.createNotification({
            userId: user._id.toString(),
            type: NotificationType.TASK_MOVED,
            title: notificationTitle,
            message: notificationMessage,
            data: {
              taskId: task._id.toString(),
              taskTitle: task.title,
              projectId: project._id.toString(),
              projectName: project.name,
              movedBy: mover.name,
              movedByEmail: mover.email,
              fromStatus,
              toStatus,
              movedAt: new Date().toISOString(),
            },
            channels: [DeliveryChannel.UI],
            metadata: {
              priority: 'normal',
            },
          });

          console.log('notificationRecord', notificationRecord);
          // Send real-time notification via WebSocket
          await this.notificationHandler.sendNotificationToUser(user._id.toString(), notificationRecord);
        } else {
          console.log('Sending email notification for offline user');
          // Send email notification for offline users
          await this.sendEmailNotification(user, {
            title: notificationTitle,
            message: notificationMessage,
            taskTitle: task.title,
            projectName: project.name,
            moverName: mover.name,
            fromStatus,
            toStatus,
          });
        }

        // Also create a persistent notification record
        await this.createNotificationRecord(user._id.toString(), {
          title: notificationTitle,
          message: notificationMessage,
          type: NotificationType.TASK_MOVED,
          data: {
            taskId: task._id.toString(),
            taskTitle: task.title,
            projectId: project._id.toString(),
            projectName: project.name,
            movedBy: mover.name,
            movedByEmail: mover.email,
            fromStatus,
            toStatus,
            movedAt: new Date().toISOString(),
          },
          channels: isOnline ? [DeliveryChannel.UI] : [DeliveryChannel.EMAIL],
        });
      }

      logger.info('Task move notifications sent', {
        taskId,
        movedByUserId,
        fromStatus,
        toStatus,
        totalUsers: allUsers.length,
      });
    } catch (error) {
      logger.error('Failed to send task move notifications', {
        error: error instanceof Error ? error.message : 'Unknown error',
        taskId,
        movedByUserId,
        fromStatus,
        toStatus,
      });
    }
  }


  private async sendEmailNotification(user: any, notification: any): Promise<void> {
    try {
      const emailTemplate = {
        to: user.email,
        subject: `Task Moved: ${notification.taskTitle}`,
        template: 'task-moved',
        data: {
          userName: user.name,
          taskTitle: notification.taskTitle,
          projectName: notification.projectName,
          moverName: notification.moverName,
          fromStatus: notification.fromStatus,
          toStatus: notification.toStatus,
          movedAt: new Date().toLocaleString(),
        },
      };

      await this.emailService.sendEmail(emailTemplate);
      logger.info('Email notification sent', { userId: user._id, email: user.email });
    } catch (error) {
      logger.error('Failed to send email notification', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: user._id,
        email: user.email,
      });
    }
  }

  private async createNotificationRecord(userId: string, notification: any): Promise<void> {
    try {
      await this.notificationService.createNotification({
        userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        channels: notification.channels,
        metadata: {
          priority: 'normal',
        },
      });
    } catch (error) {
      logger.error('Failed to create notification record', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
    }
  }
}
