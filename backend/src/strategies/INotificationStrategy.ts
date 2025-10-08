import { INotificationStrategy, INotificationStrategyResult, INotificationStrategyContext } from '../interfaces/INotificationStrategy';
import { DeliveryChannel } from '../enums';

export abstract class BaseNotificationStrategy implements INotificationStrategy {
  abstract channel: DeliveryChannel;
  abstract priority: number;

  abstract canDeliver(context: INotificationStrategyContext): Promise<boolean>;
  abstract deliver(context: INotificationStrategyContext): Promise<INotificationStrategyResult>;

  getPriority(): number {
    return this.priority;
  }

  protected isQuietHours(context: INotificationStrategyContext): boolean {
    const { user } = context;
    const preferences = user.preferences;
    
    if (!preferences.quietHours.enabled) return false;
    
    const now = new Date();
    const userTimezone = preferences.quietHours.timezone || 'UTC';
    
    // Convert to user's timezone
    const userTime = new Date(now.toLocaleString('en-US', { timeZone: userTimezone }));
    const currentTime = userTime.getHours() * 60 + userTime.getMinutes();
    
    const startTime = this.parseTime(preferences.quietHours.startTime);
    const endTime = this.parseTime(preferences.quietHours.endTime);
    
    if (startTime <= endTime) {
      // Same day (e.g., 22:00 to 23:00)
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Overnight (e.g., 22:00 to 08:00)
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  protected parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  protected isChannelMuted(context: INotificationStrategyContext): boolean {
    const { user } = context;
    return user.preferences.mutedChannels.includes(this.channel.toLowerCase());
  }

  protected isNotificationTypeEnabled(context: INotificationStrategyContext): boolean {
    const { user, notification } = context;
    const typePreference = user.preferences.notificationTypes[notification.type];
    
    if (!typePreference) return true; // Default to enabled if not specified
    
    return typePreference[this.channel.toLowerCase()] !== false;
  }
}
