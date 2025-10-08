import { DeliveryChannel } from '../enums';
import { INotificationStrategy } from '../interfaces/INotificationStrategy';
import { UINotificationStrategy } from './UINotificationStrategy';
import { EmailNotificationStrategy } from './EmailNotificationStrategy';
import { PushNotificationStrategy } from './PushNotificationStrategy';
import { EmailService } from '../services/email/EmailService';

export class NotificationStrategyFactory {
  private strategies: Map<DeliveryChannel, INotificationStrategy> = new Map();
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    this.emailService = emailService;
    this.initializeStrategies();
  }

  private initializeStrategies(): void {
    // Initialize all notification strategies
    this.strategies.set(DeliveryChannel.UI, new UINotificationStrategy());
    this.strategies.set(DeliveryChannel.EMAIL, new EmailNotificationStrategy(this.emailService));
    this.strategies.set(DeliveryChannel.PUSH, new PushNotificationStrategy());
    
    // Add more strategies as needed
    // this.strategies.set(DeliveryChannel.SMS, new SMSNotificationStrategy());
    // this.strategies.set(DeliveryChannel.WEBHOOK, new WebhookNotificationStrategy());
  }

  getStrategy(channel: DeliveryChannel): INotificationStrategy | null {
    return this.strategies.get(channel) || null;
  }

  getAllStrategies(): INotificationStrategy[] {
    return Array.from(this.strategies.values());
  }

  getAvailableChannels(): DeliveryChannel[] {
    return Array.from(this.strategies.keys());
  }

  getStrategiesByPriority(): INotificationStrategy[] {
    return this.getAllStrategies().sort((a, b) => a.getPriority() - b.getPriority());
  }

  addStrategy(channel: DeliveryChannel, strategy: INotificationStrategy): void {
    this.strategies.set(channel, strategy);
  }

  removeStrategy(channel: DeliveryChannel): boolean {
    return this.strategies.delete(channel);
  }

  hasStrategy(channel: DeliveryChannel): boolean {
    return this.strategies.has(channel);
  }
}
