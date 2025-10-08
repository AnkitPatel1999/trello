export interface IUser {
  email: string;
  name: string;
  lastSeen: Date;
  isOnline: boolean;
  timezone?: string;
  language?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateUserRequest {
  email: string;
  name: string;
  timezone?: string;
  language?: string;
}

export interface IUpdateUserRequest {
  name?: string;
  lastSeen?: Date;
  isOnline?: boolean;
  timezone?: string;
  language?: string;
}

export interface IUserActivity {
  userId: string;
  isOnline: boolean;
  lastSeen: Date;
  deviceInfo?: {
    userAgent: string;
    platform: string;
    browser: string;
  };
  location?: {
    ip: string;
    country?: string;
    city?: string;
  };
}

export interface IUserSession {
  userId: string;
  socketId: string;
  deviceInfo: {
    userAgent: string;
    platform: string;
    browser: string;
    deviceType: 'desktop' | 'mobile' | 'tablet';
  };
  connectedAt: Date;
  lastActivity: Date;
  isActive: boolean;
  ipAddress?: string;
  location?: {
    country?: string;
    city?: string;
  };
}

export interface IUserPreference {
  userId: string;
  emailEnabled: boolean;
  uiEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  digestFrequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  mutedChannels: string[];
  quietHours: {
    enabled: boolean;
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
    timezone: string;
  };
  notificationTypes: {
    [key: string]: {
      email: boolean;
      ui: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateUserPreferenceRequest {
  emailEnabled?: boolean;
  uiEnabled?: boolean;
  pushEnabled?: boolean;
  smsEnabled?: boolean;
  digestFrequency?: 'immediate' | 'hourly' | 'daily' | 'weekly';
  mutedChannels?: string[];
  quietHours?: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    timezone: string;
  };
  notificationTypes?: {
    [key: string]: {
      email: boolean;
      ui: boolean;
      push: boolean;
      sms: boolean;
    };
  };
}
