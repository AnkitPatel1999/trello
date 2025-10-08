import { NotificationType, NotificationStatus, DeliveryChannel } from '../enums';

export interface INotification {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  channels: DeliveryChannel[];
  status: NotificationStatus;
  sentAt?: Date;
  readAt?: Date;
  deliveryAttempts: number;
  metadata: {
    sourceId?: string;
    sourceType?: string;
    triggeredBy?: string;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    expiresAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateNotificationRequest {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  channels?: DeliveryChannel[];
  metadata?: {
    sourceId?: string;
    sourceType?: string;
    triggeredBy?: string;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    expiresAt?: Date;
  };
}

export interface IUpdateNotificationRequest {
  status?: NotificationStatus;
  readAt?: Date;
  deliveryAttempts?: number;
}

export interface INotificationFilter {
  userId?: string;
  type?: NotificationType;
  status?: NotificationStatus;
  channels?: DeliveryChannel[];
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'sentAt' | 'readAt';
  sortOrder?: 'asc' | 'desc';
}

export interface INotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byStatus: Record<NotificationStatus, number>;
  byChannel: Record<DeliveryChannel, number>;
}

export interface IBatchNotificationRequest {
  userIds: string[];
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  channels?: DeliveryChannel[];
  metadata?: {
    sourceId?: string;
    sourceType?: string;
    triggeredBy?: string;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    expiresAt?: Date;
  };
}
