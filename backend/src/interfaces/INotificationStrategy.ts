import { INotification } from './INotification';
import { DeliveryChannel } from '../enums';

export interface INotificationStrategy {
  channel: DeliveryChannel;
  canDeliver(context: INotificationStrategyContext): Promise<boolean>;
  deliver(context: INotificationStrategyContext): Promise<INotificationStrategyResult>;
  getPriority(): number;
}

export interface INotificationStrategyResult {
  success: boolean;
  error?: string;
  deliveryId?: string;
  deliveredAt?: Date;
}

export interface INotificationStrategyContext {
  user: {
    id: string;
    email: string;
    name: string;
    isOnline: boolean;
    lastSeen: Date;
    preferences: {
      emailEnabled: boolean;
      uiEnabled: boolean;
      pushEnabled: boolean;
      smsEnabled: boolean;
      digestFrequency: string;
      quietHours: {
        enabled: boolean;
        startTime: string;
        endTime: string;
        timezone: string;
      };
      mutedChannels: string[];
      notificationTypes: Record<string, Record<string, boolean>>;
    };
  };
  notification: INotification;
  retryAttempt: number;
  maxRetries: number;
}
