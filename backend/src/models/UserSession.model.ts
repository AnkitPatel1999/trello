import mongoose, { Schema, Document } from 'mongoose';
import { IUserSession } from '../interfaces/IUser';

export interface IUserSessionDocument extends IUserSession, Document {}

const UserSessionSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  socketId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  deviceInfo: {
    userAgent: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      required: true,
    },
    browser: {
      type: String,
      required: true,
    },
    deviceType: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet'],
      required: true,
    },
  },
  connectedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
    index: true,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  ipAddress: {
    type: String,
    index: true,
  },
  location: {
    country: String,
    city: String,
  },
}, {
  timestamps: true,
  collection: 'user_sessions',
});

// Indexes
UserSessionSchema.index({ userId: 1, isActive: 1 });
UserSessionSchema.index({ socketId: 1 });
UserSessionSchema.index({ lastActivity: -1 });
UserSessionSchema.index({ connectedAt: -1 });

// TTL index for inactive sessions (cleanup after 24 hours of inactivity)
UserSessionSchema.index({ lastActivity: 1 }, { expireAfterSeconds: 24 * 60 * 60 });

// Virtual for session duration
UserSessionSchema.virtual('duration').get(function() {
  return Date.now() - this.connectedAt.getTime();
});

// Virtual for isRecentlyActive
UserSessionSchema.virtual('isRecentlyActive').get(function() {
  const now = new Date();
  const timeDiff = now.getTime() - this.lastActivity.getTime();
  const minutesDiff = Math.floor(timeDiff / (1000 * 60));
  return minutesDiff < 5;
});

// Methods
UserSessionSchema.methods.updateActivity = function() {
  this.lastActivity = new Date();
  return this.save();
};

UserSessionSchema.methods.deactivate = function() {
  this.isActive = false;
  return this.save();
};

UserSessionSchema.methods.activate = function() {
  this.isActive = true;
  this.lastActivity = new Date();
  return this.save();
};

// Static methods
UserSessionSchema.statics.findActiveSessions = function(userId?: string) {
  const query = this.find({ isActive: true });
  if (userId) {
    query.where('userId').equals(userId);
  }
  return query;
};

UserSessionSchema.statics.findByUserId = function(userId: string) {
  return this.find({ userId }).sort({ connectedAt: -1 });
};

UserSessionSchema.statics.findBySocketId = function(socketId: string) {
  return this.findOne({ socketId });
};

UserSessionSchema.statics.cleanupInactiveSessions = function() {
  const threshold = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
  return this.deleteMany({
    lastActivity: { $lt: threshold },
    isActive: false
  });
};

UserSessionSchema.statics.getActiveUserCount = function() {
  return this.distinct('userId', { isActive: true });
};

export const UserSession = mongoose.model<IUserSessionDocument>('UserSession', UserSessionSchema);
