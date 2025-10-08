export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  RETRYING = 'RETRYING',
}

export const NotificationStatusLabels: Record<NotificationStatus, string> = {
  [NotificationStatus.PENDING]: 'Pending',
  [NotificationStatus.SENT]: 'Sent',
  [NotificationStatus.DELIVERED]: 'Delivered',
  [NotificationStatus.READ]: 'Read',
  [NotificationStatus.FAILED]: 'Failed',
  [NotificationStatus.CANCELLED]: 'Cancelled',
  [NotificationStatus.RETRYING]: 'Retrying',
};

export const NotificationStatusColors: Record<NotificationStatus, string> = {
  [NotificationStatus.PENDING]: '#f59e0b', // amber
  [NotificationStatus.SENT]: '#3b82f6', // blue
  [NotificationStatus.DELIVERED]: '#10b981', // green
  [NotificationStatus.READ]: '#6b7280', // gray
  [NotificationStatus.FAILED]: '#ef4444', // red
  [NotificationStatus.CANCELLED]: '#6b7280', // gray
  [NotificationStatus.RETRYING]: '#f59e0b', // amber
};
