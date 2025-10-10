export enum NotificationType {
  // Comment-related notifications
  COMMENT = 'COMMENT',
  COMMENT_REPLY = 'COMMENT_REPLY',
  MENTION = 'MENTION',
  
  // Task/Project notifications
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_UPDATED = 'TASK_UPDATED',
  TASK_MOVED = 'TASK_MOVED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  TASK_DUE_SOON = 'TASK_DUE_SOON',
  TASK_OVERDUE = 'TASK_OVERDUE',
  
  // Project notifications
  PROJECT_CREATED = 'PROJECT_CREATED',
  PROJECT_UPDATED = 'PROJECT_UPDATED',
  PROJECT_DELETED = 'PROJECT_DELETED',
  PROJECT_MEMBER_ADDED = 'PROJECT_MEMBER_ADDED',
  PROJECT_MEMBER_REMOVED = 'PROJECT_MEMBER_REMOVED',
  
  // System notifications
  SYSTEM_UPDATE = 'SYSTEM_UPDATE',
  MAINTENANCE = 'MAINTENANCE',
  SECURITY_ALERT = 'SECURITY_ALERT',
  
  // User notifications
  WELCOME = 'WELCOME',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  EMAIL_VERIFIED = 'EMAIL_VERIFIED',
  
  // Team notifications
  TEAM_INVITATION = 'TEAM_INVITATION',
  TEAM_JOINED = 'TEAM_JOINED',
  TEAM_LEFT = 'TEAM_LEFT',
  
  // File notifications
  FILE_UPLOADED = 'FILE_UPLOADED',
  FILE_SHARED = 'FILE_SHARED',
  FILE_DELETED = 'FILE_DELETED',
  
  // Meeting notifications
  MEETING_SCHEDULED = 'MEETING_SCHEDULED',
  MEETING_CANCELLED = 'MEETING_CANCELLED',
  MEETING_REMINDER = 'MEETING_REMINDER',
}

export const NotificationTypeLabels: Record<NotificationType, string> = {
  [NotificationType.COMMENT]: 'New Comment',
  [NotificationType.COMMENT_REPLY]: 'Comment Reply',
  [NotificationType.MENTION]: 'You were mentioned',
  [NotificationType.TASK_ASSIGNED]: 'Task Assigned',
  [NotificationType.TASK_UPDATED]: 'Task Updated',
  [NotificationType.TASK_MOVED]: 'Task Moved',
  [NotificationType.TASK_COMPLETED]: 'Task Completed',
  [NotificationType.TASK_DUE_SOON]: 'Task Due Soon',
  [NotificationType.TASK_OVERDUE]: 'Task Overdue',
  [NotificationType.PROJECT_CREATED]: 'Project Created',
  [NotificationType.PROJECT_UPDATED]: 'Project Updated',
  [NotificationType.PROJECT_DELETED]: 'Project Deleted',
  [NotificationType.PROJECT_MEMBER_ADDED]: 'Member Added',
  [NotificationType.PROJECT_MEMBER_REMOVED]: 'Member Removed',
  [NotificationType.SYSTEM_UPDATE]: 'System Update',
  [NotificationType.MAINTENANCE]: 'Maintenance',
  [NotificationType.SECURITY_ALERT]: 'Security Alert',
  [NotificationType.WELCOME]: 'Welcome',
  [NotificationType.PASSWORD_CHANGED]: 'Password Changed',
  [NotificationType.EMAIL_VERIFIED]: 'Email Verified',
  [NotificationType.TEAM_INVITATION]: 'Team Invitation',
  [NotificationType.TEAM_JOINED]: 'Team Joined',
  [NotificationType.TEAM_LEFT]: 'Team Left',
  [NotificationType.FILE_UPLOADED]: 'File Uploaded',
  [NotificationType.FILE_SHARED]: 'File Shared',
  [NotificationType.FILE_DELETED]: 'File Deleted',
  [NotificationType.MEETING_SCHEDULED]: 'Meeting Scheduled',
  [NotificationType.MEETING_CANCELLED]: 'Meeting Cancelled',
  [NotificationType.MEETING_REMINDER]: 'Meeting Reminder',
};
