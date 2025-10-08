import { INotification } from './INotification';
import { DeliveryChannel } from '../enums';

export interface INotificationStrategy {
  channel: DeliveryChannel;
  canDeliver(notification: INotification): Promise<boolean>;
  deliver(notification: INotification): Promise<boolean>;
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
    };
  };
  notification: INotification;
  retryAttempt: number;
  maxRetries: number;
}
