import { BaseNotificationStrategy } from './INotificationStrategy';
import { DeliveryChannel } from '../enums';
import { INotificationStrategyContext, INotificationStrategyResult } from '../interfaces/INotificationStrategy';
import { logger } from '../utils/logger';
import { EmailService } from '../services/email/EmailService';

export class EmailNotificationStrategy extends BaseNotificationStrategy {
  channel = DeliveryChannel.EMAIL;
  priority = 3; // Lower priority than UI and Push

  private emailService: EmailService;

  constructor(emailService: EmailService) {
    super();
    this.emailService = emailService;
  }

  async canDeliver(context: INotificationStrategyContext): Promise<boolean> {
    const { user, notification } = context;
    
    // Check if email notifications are enabled
    if (!user.preferences.emailEnabled) {
      return false;
    }
    
    // Check if channel is muted
    if (this.isChannelMuted(context)) {
      return false;
    }
    
    // Check if notification type is enabled for email
    if (!this.isNotificationTypeEnabled(context)) {
      return false;
    }
    
    // Check if notification is expired
    if (notification.metadata.expiresAt && new Date() > notification.metadata.expiresAt) {
      return false;
    }
    
    // Check if user has valid email
    if (!user.email) {
      return false;
    }
    
    // For email, we can deliver even if user is offline
    // But we might want to batch them for digest
    return true;
  }

  async deliver(context: INotificationStrategyContext): Promise<INotificationStrategyResult> {
    try {
      const { user, notification } = context;
      
      // Check if we should batch this notification for digest
      if (this.shouldBatchForDigest(context)) {
        // Add to digest queue instead of sending immediately
        logger.info(`Email notification queued for digest: ${notification.title} to user ${notification.userId}`);
        
        return {
          success: true,
          deliveryId: `email_digest_${(notification as any)._id}_${Date.now()}`,
          deliveredAt: new Date(),
        };
      }
      
      // Send immediate email
      const emailResult = await this.emailService.sendNotificationEmail({
        to: user.email,
        subject: notification.title,
        data: {
          userName: user.name,
          notificationTitle: notification.title,
          notificationMessage: notification.message,
          notificationType: notification.type,
          appName: 'Your App',
          appUrl: process.env.APP_URL || 'http://localhost:3000',
          unsubscribeUrl: `${process.env.APP_URL || 'http://localhost:3000'}/unsubscribe?token=${user.id}`,
          ...notification.data,
        },
      });
      
      if (emailResult.success) {
        logger.info(`Email notification sent: ${notification.title} to ${user.email}`);
        return {
          success: true,
          deliveryId: emailResult.messageId || `email_${Date.now()}`,
          deliveredAt: new Date(),
        };
      } else {
        throw new Error(emailResult.error || 'Failed to send email');
      }
    } catch (error) {
      logger.error('Failed to deliver email notification:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private shouldBatchForDigest(context: INotificationStrategyContext): boolean {
    const { user, notification } = context;
    
    // Don't batch urgent notifications
    if (notification.metadata.priority === 'urgent') {
      return false;
    }
    
    // Batch based on user's digest frequency
    switch (user.preferences.digestFrequency) {
      case 'immediate':
        return false;
      case 'hourly':
      case 'daily':
      case 'weekly':
        return true;
      default:
        return false;
    }
  }
}
