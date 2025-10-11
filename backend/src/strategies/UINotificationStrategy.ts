import { BaseNotificationStrategy } from './INotificationStrategy';
import { DeliveryChannel } from '../enums';
import { INotificationStrategyContext, INotificationStrategyResult } from '../interfaces/INotificationStrategy';
import { logger } from '../utils/logger';

export class UINotificationStrategy extends BaseNotificationStrategy {
  channel = DeliveryChannel.UI;
  priority = 1; // Highest priority

  async canDeliver(context: INotificationStrategyContext): Promise<boolean> {
    const { user, notification } = context;
    
    // Check if user is online
    if (!user.isOnline) {
      return false;
    }
    
    // Check if UI notifications are enabled
    if (!user.preferences.uiEnabled) {
      return false;
    }
    
    // Check if channel is muted
    if (this.isChannelMuted(context)) {
      return false;
    }
    
    // Check if notification type is enabled for UI
    if (!this.isNotificationTypeEnabled(context)) {
      return false;
    }
    
    // Check if notification is expired
    if (notification.metadata.expiresAt && new Date() > notification.metadata.expiresAt) {
      return false;
    }
    
    return true;
  }

  async deliver(context: INotificationStrategyContext): Promise<INotificationStrategyResult> {
    try {
      const { notification } = context;
      
      // In a real implementation, this would send the notification via WebSocket
      // For now, we'll simulate the delivery
      logger.info(`UI notification delivered: ${notification.title} to user ${notification.userId}`);
      
      return {
        success: true,
        deliveryId: `ui_${(notification as any)._id}_${Date.now()}`,
        deliveredAt: new Date(),
      };
    } catch (error) {
      logger.error('Failed to deliver UI notification:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
