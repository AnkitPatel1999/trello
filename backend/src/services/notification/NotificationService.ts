import { INotification, ICreateNotificationRequest } from '../../interfaces/INotification';
import { NotificationStatus } from '../../enums/NotificationStatus.enum';
import { DeliveryChannel } from '../../enums/DeliveryChannel.enum';
import { NotificationRepository } from '../../repositories/NotificationRepository';

export class NotificationService {
  private notificationRepository: NotificationRepository;

  constructor(notificationRepository: NotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async createNotification(request: ICreateNotificationRequest): Promise<INotification> {
    const notification: INotification = {
      userId: request.userId,
      type: request.type,
      title: request.title,
      message: request.message,
      data: request.data || {},
      channels: request.channels || [DeliveryChannel.UI],
      status: NotificationStatus.PENDING,
      deliveryAttempts: 0,
      metadata: {
        priority: request.metadata?.priority || 'normal',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.notificationRepository.create(notification);
  }



  async markAsRead(notificationId: string): Promise<INotification | null> {
    return await this.notificationRepository.update(notificationId, {
      status: NotificationStatus.READ,
      readAt: new Date(),
    });
  }

  async markAllAsRead(userId: string): Promise<number> {
    return await this.notificationRepository.markAllAsRead(userId);
  }

  async getNotifications(userId: string, options: any = {}): Promise<INotification[]> {
    return await this.notificationRepository.findByUser(userId, options);
  }

  async getNotificationStats(userId: string): Promise<any> {
    return await this.notificationRepository.getStats(userId);
  }
}
