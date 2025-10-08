import { Notification, INotificationDocument } from '../models/Notification.model';
import { NotificationStatus } from '../enums/NotificationStatus.enum';

export class NotificationRepository {
  constructor() {}

  async create(data: any): Promise<any> {
    return await Notification.create(data);
  }

  async findByUser(userId: string, options: any = {}): Promise<any[]> {
    const filter: any = { userId };
    
    if (options.status) {
      filter.status = options.status;
    }
    
    if (options.type) {
      filter.type = options.type;
    }
    
    if (options.unread) {
      filter.readAt = null;
    }

    return await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(options.limit || 50)
      .skip(options.offset || 0);
  }

  async update(id: string, data: any): Promise<any> {
    return await Notification.findByIdAndUpdate(id, data, { new: true });
  }

  async markAllAsRead(userId: string): Promise<number> {
    const result = await Notification.updateMany(
      { userId, readAt: null },
      { 
        status: NotificationStatus.READ,
        readAt: new Date() 
      }
    );
    return result.modifiedCount;
  }

  async getStats(userId?: string): Promise<any> {
    const matchStage: any = {};
    if (userId) {
      matchStage.userId = userId;
    }
    
    const result = await Notification.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          unread: {
            $sum: {
              $cond: [{ $eq: ['$readAt', null] }, 1, 0]
            }
          }
        }
      }
    ]);

    return result[0] || { total: 0, unread: 0 };
  }
}