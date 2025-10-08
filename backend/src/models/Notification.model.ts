import mongoose, { Schema, Document } from 'mongoose';
import { INotification } from '../interfaces/INotification';
import { NotificationType } from '../enums/NotificationType.enum';
import { NotificationStatus } from '../enums/NotificationStatus.enum';
import { DeliveryChannel } from '../enums/DeliveryChannel.enum';

export interface INotificationDocument extends INotification, Document {}

const NotificationSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: Object.values(NotificationType),
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  data: {
    type: Schema.Types.Mixed,
    default: {},
  },
  channels: [{
    type: String,
    enum: Object.values(DeliveryChannel),
    required: true,
  }],
  status: {
    type: String,
    enum: Object.values(NotificationStatus),
    default: NotificationStatus.PENDING,
    index: true,
  },
  sentAt: {
    type: Date,
    index: true,
  },
  readAt: {
    type: Date,
    index: true,
  },
  deliveryAttempts: {
    type: Number,
    default: 0,
  },
  metadata: {
    sourceId: {
      type: String,
      index: true,
    },
    sourceType: {
      type: String,
      index: true,
    },
    triggeredBy: {
      type: String,
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal',
      index: true,
    },
    expiresAt: {
      type: Date,
      index: true,
    },
  },
}, {
  timestamps: true,
  collection: 'notifications',
});

// Compound indexes for common queries
NotificationSchema.index({ userId: 1, status: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, type: 1, createdAt: -1 });
NotificationSchema.index({ status: 1, createdAt: -1 });
NotificationSchema.index({ 'metadata.priority': 1, createdAt: -1 });
NotificationSchema.index({ 'metadata.expiresAt': 1 }, { expireAfterSeconds: 0 });

// TTL index for automatic cleanup of old notifications
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 }); // 90 days

// Virtual for notification age
NotificationSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt.getTime();
});

// Virtual for isExpired
NotificationSchema.virtual('isExpired').get(function() {
  if (!this.metadata.expiresAt) return false;
  return new Date() > this.metadata.expiresAt;
});

// Methods
NotificationSchema.methods.markAsRead = function() {
  this.readAt = new Date();
  this.status = NotificationStatus.READ;
  return this.save();
};

NotificationSchema.methods.markAsSent = function() {
  this.sentAt = new Date();
  this.status = NotificationStatus.SENT;
  return this.save();
};

NotificationSchema.methods.markAsFailed = function() {
  this.status = NotificationStatus.FAILED;
  return this.save();
};

NotificationSchema.methods.incrementDeliveryAttempts = function() {
  this.deliveryAttempts += 1;
  return this.save();
};

// Static methods
NotificationSchema.statics.findByUser = function(userId: string, options: any = {}) {
  const query = this.find({ userId });
  
  if (options.status) {
    query.where('status').equals(options.status);
  }
  
  if (options.type) {
    query.where('type').equals(options.type);
  }
  
  if (options.unread) {
    query.where('readAt').equals(null);
  }
  
  return query.sort({ createdAt: -1 });
};

NotificationSchema.statics.findPending = function() {
  return this.find({ status: NotificationStatus.PENDING });
};

NotificationSchema.statics.findFailed = function() {
  return this.find({ status: NotificationStatus.FAILED });
};

NotificationSchema.statics.findExpired = function() {
  return this.find({
    'metadata.expiresAt': { $lt: new Date() }
  });
};

NotificationSchema.statics.getStats = function(userId?: string) {
  const matchStage: any = {};
  if (userId) {
    matchStage.userId = userId;
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        unread: {
          $sum: {
            $cond: [{ $eq: ['$readAt', null] }, 1, 0]
          }
        },
        byType: {
          $push: {
            type: '$type',
            count: 1
          }
        },
        byStatus: {
          $push: {
            status: '$status',
            count: 1
          }
        }
      }
    }
  ]);
};

export const Notification = mongoose.model<INotificationDocument>('Notification', NotificationSchema);
