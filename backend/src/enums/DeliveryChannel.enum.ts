export enum DeliveryChannel {
  EMAIL = 'EMAIL',
  UI = 'UI',
  PUSH = 'PUSH',
  SMS = 'SMS',
  WEBHOOK = 'WEBHOOK',
}

export const DeliveryChannelLabels: Record<DeliveryChannel, string> = {
  [DeliveryChannel.EMAIL]: 'Email',
  [DeliveryChannel.UI]: 'In-App',
  [DeliveryChannel.PUSH]: 'Push Notification',
  [DeliveryChannel.SMS]: 'SMS',
  [DeliveryChannel.WEBHOOK]: 'Webhook',
};

export const DeliveryChannelIcons: Record<DeliveryChannel, string> = {
  [DeliveryChannel.EMAIL]: '📧',
  [DeliveryChannel.UI]: '🔔',
  [DeliveryChannel.PUSH]: '📱',
  [DeliveryChannel.SMS]: '💬',
  [DeliveryChannel.WEBHOOK]: '🔗',
};

export const DeliveryChannelPriorities: Record<DeliveryChannel, number> = {
  [DeliveryChannel.UI]: 1, // Highest priority
  [DeliveryChannel.PUSH]: 2,
  [DeliveryChannel.EMAIL]: 3,
  [DeliveryChannel.SMS]: 4,
  [DeliveryChannel.WEBHOOK]: 5, // Lowest priority
};
