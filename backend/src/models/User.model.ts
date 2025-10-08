import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../interfaces/IUser';

export interface IUserDocument extends IUser, Document {}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
    index: true,
  },
  isOnline: {
    type: Boolean,
    default: false,
    index: true,
  },
  timezone: {
    type: String,
    default: 'UTC',
  },
  language: {
    type: String,
    default: 'en',
  },
}, {
  timestamps: true,
  collection: 'users',
});

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ isOnline: 1, lastSeen: -1 });
UserSchema.index({ createdAt: -1 });

// Virtual for user activity status
UserSchema.virtual('activityStatus').get(function() {
  const now = new Date();
  const timeDiff = now.getTime() - this.lastSeen.getTime();
  const minutesDiff = Math.floor(timeDiff / (1000 * 60));
  
  if (this.isOnline) {
    return 'online';
  } else if (minutesDiff < 5) {
    return 'recently_online';
  } else if (minutesDiff < 60) {
    return 'away';
  } else {
    return 'offline';
  }
});

// Methods
UserSchema.methods.updateLastSeen = function() {
  this.lastSeen = new Date();
  return this.save();
};

UserSchema.methods.setOnlineStatus = function(isOnline: boolean) {
  this.isOnline = isOnline;
  if (isOnline) {
    this.lastSeen = new Date();
  }
  return this.save();
};

// Static methods
UserSchema.statics.findActiveUsers = function(minutesThreshold = 15) {
  const threshold = new Date(Date.now() - minutesThreshold * 60 * 1000);
  return this.find({
    $or: [
      { isOnline: true },
      { lastSeen: { $gte: threshold } }
    ]
  });
};

UserSchema.statics.findOnlineUsers = function() {
  return this.find({ isOnline: true });
};

UserSchema.statics.findOfflineUsers = function() {
  return this.find({ isOnline: false });
};

export const User = mongoose.model<IUserDocument>('User', UserSchema);
