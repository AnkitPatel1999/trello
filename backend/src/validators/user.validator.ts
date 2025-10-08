import Joi from 'joi';

export const userValidator = {
  updateActivity: Joi.object({
    userId: Joi.string().required(),
    isOnline: Joi.boolean().required(),
    lastSeen: Joi.date().optional(),
    deviceInfo: Joi.object({
      userAgent: Joi.string().optional(),
      platform: Joi.string().optional(),
      browser: Joi.string().optional(),
    }).optional(),
    location: Joi.object({
      ip: Joi.string().optional(),
      country: Joi.string().optional(),
      city: Joi.string().optional(),
    }).optional(),
  }),

  updatePreferences: Joi.object({
    emailEnabled: Joi.boolean().optional(),
    uiEnabled: Joi.boolean().optional(),
    pushEnabled: Joi.boolean().optional(),
    smsEnabled: Joi.boolean().optional(),
    digestFrequency: Joi.string().valid('immediate', 'hourly', 'daily', 'weekly').optional(),
    mutedChannels: Joi.array().items(Joi.string()).optional(),
    quietHours: Joi.object({
      enabled: Joi.boolean().optional(),
      startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
      endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
      timezone: Joi.string().optional(),
    }).optional(),
    notificationTypes: Joi.object().pattern(
      Joi.string(),
      Joi.object({
        email: Joi.boolean().optional(),
        ui: Joi.boolean().optional(),
        push: Joi.boolean().optional(),
        sms: Joi.boolean().optional(),
      })
    ).optional(),
  }),

  createUser: Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(1).max(100).required(),
    timezone: Joi.string().optional(),
    language: Joi.string().optional(),
  }),

  updateUser: Joi.object({
    name: Joi.string().min(1).max(100).optional(),
    lastSeen: Joi.date().optional(),
    isOnline: Joi.boolean().optional(),
    timezone: Joi.string().optional(),
    language: Joi.string().optional(),
  }),
};
