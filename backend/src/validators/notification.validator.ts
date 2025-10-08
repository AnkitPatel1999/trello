import Joi from 'joi';
import { NotificationType } from '../enums/NotificationType.enum';
import { DeliveryChannel } from '../enums/DeliveryChannel.enum';

export const notificationValidator = {
  createNotification: Joi.object({
    userId: Joi.string().required(),
    type: Joi.string().valid(...Object.values(NotificationType)).required(),
    title: Joi.string().min(1).max(200).required(),
    message: Joi.string().min(1).max(1000).required(),
    data: Joi.object().optional(),
    channels: Joi.array().items(
      Joi.string().valid(...Object.values(DeliveryChannel))
    ).optional(),
    metadata: Joi.object({
      sourceId: Joi.string().optional(),
      sourceType: Joi.string().optional(),
      triggeredBy: Joi.string().optional(),
      priority: Joi.string().valid('low', 'normal', 'high', 'urgent').optional(),
      expiresAt: Joi.date().optional(),
    }).optional(),
  }),

  createBatchNotifications: Joi.object({
    userIds: Joi.array().items(Joi.string()).min(1).required(),
    type: Joi.string().valid(...Object.values(NotificationType)).required(),
    title: Joi.string().min(1).max(200).required(),
    message: Joi.string().min(1).max(1000).required(),
    data: Joi.object().optional(),
    channels: Joi.array().items(
      Joi.string().valid(...Object.values(DeliveryChannel))
    ).optional(),
    metadata: Joi.object({
      sourceId: Joi.string().optional(),
      sourceType: Joi.string().optional(),
      triggeredBy: Joi.string().optional(),
      priority: Joi.string().valid('low', 'normal', 'high', 'urgent').optional(),
      expiresAt: Joi.date().optional(),
    }).optional(),
  }),

  updateNotification: Joi.object({
    status: Joi.string().valid('PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED', 'CANCELLED', 'RETRYING').optional(),
    readAt: Joi.date().optional(),
    deliveryAttempts: Joi.number().min(0).optional(),
  }),

  getNotifications: Joi.object({
    status: Joi.string().valid('PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED', 'CANCELLED', 'RETRYING').optional(),
    type: Joi.string().valid(...Object.values(NotificationType)).optional(),
    unread: Joi.boolean().optional(),
    limit: Joi.number().min(1).max(100).optional(),
    offset: Joi.number().min(0).optional(),
    sortBy: Joi.string().valid('createdAt', 'sentAt', 'readAt').optional(),
    sortOrder: Joi.string().valid('asc', 'desc').optional(),
  }),
};
