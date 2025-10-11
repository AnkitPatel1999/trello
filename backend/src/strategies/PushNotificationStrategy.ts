import { BaseNotificationStrategy } from './INotificationStrategy';
import { DeliveryChannel } from '../enums';
import { INotificationStrategyContext, INotificationStrategyResult } from '../interfaces/INotificationStrategy';
import { logger } from '../utils/logger';

export class PushNotificationStrategy extends BaseNotificationStrategy {
  channel = DeliveryChannel.PUSH;
  priority = 2; // Higher priority than email

  async canDeliver(context: INotificationStrategyContext): Promise<boolean> {
    const { user, notification } = context;
    
    // Check if push notifications are enabled
    if (!user.preferences.pushEnabled) {
      return false;
    }
    
    // Check if channel is muted
    if (this.isChannelMuted(context)) {
      return false;
    }
    
    // Check if notification type is enabled for push
    if (!this.isNotificationTypeEnabled(context)) {
      return false;
    }
    
    // Check if notification is expired
    if (notification.metadata.expiresAt && new Date() > notification.metadata.expiresAt) {
      return false;
    }
    
    // Check if user is in quiet hours
    if (this.isQuietHours(context)) {
      return false;
    }
    
    // For push notifications, we can deliver even if user is offline
    // But we need to check if user has push tokens registered
    return this.hasPushTokens(user.id);
  }

  async deliver(context: INotificationStrategyContext): Promise<INotificationStrategyResult> {
    try {
      const { user, notification } = context;
      
      // In a real implementation, this would send push notifications via FCM/APNS
      // For now, we'll simulate the delivery
      logger.info(`Push notification sent: ${notification.title} to user ${notification.userId}`);
      
      return {
        success: true,
        deliveryId: `push_${(notification as any)._id}_${Date.now()}`,
        deliveredAt: new Date(),
      };
    } catch (error) {
      logger.error('Failed to deliver push notification:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private hasPushTokens(userId: string): boolean {
    // In a real implementation, this would check if user has registered push tokens
    // For now, we'll assume all users have push tokens
    return true;
  }
}
