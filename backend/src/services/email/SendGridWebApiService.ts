import sgMail from '@sendgrid/mail';
import { logger } from '../../utils/logger';

export interface ISendGridWebApiOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from: string;
  fromName?: string;
}

export interface ISendGridWebApiResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class SendGridWebApiService {
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    this.apiKey = process.env.SENDGRID_API_KEY || '';
    this.fromEmail = process.env.SENDGRID_FROM_EMAIL || '';
    this.fromName = process.env.SENDGRID_FROM_NAME || 'Notification Service';
    
    // Set the API key for SendGrid
    if (this.apiKey) {
      sgMail.setApiKey(this.apiKey);
    }
  }

  async sendEmail(options: ISendGridWebApiOptions): Promise<ISendGridWebApiResult> {
    try {
      if (!this.apiKey) {
        throw new Error('SendGrid API key not configured');
      }

      if (!this.apiKey.startsWith('SG.')) {
        throw new Error('Invalid SendGrid API key format');
      }

      if (!this.fromEmail) {
        throw new Error('SendGrid from email not configured');
      }

      logger.info('Sending email via SendGrid Web API', {
        to: options.to,
        subject: options.subject,
        fromEmail: this.fromEmail,
        fromName: this.fromName,
      });

      const msg = {
        to: options.to,
        from: {
          email: this.fromEmail,
          name: this.fromName,
        },
        subject: options.subject,
        text: options.text || '',
        html: options.html,
      };

      const response = await sgMail.send(msg);

      logger.info('SendGrid Web API response received', {
        statusCode: response[0].statusCode,
        messageId: response[0].headers['x-message-id'],
        rateLimitRemaining: response[0].headers['x-ratelimit-remaining'],
      });

      logger.info('Email sent successfully via SendGrid Web API', {
        to: options.to,
        subject: options.subject,
        statusCode: response[0].statusCode,
      });

      return {
        success: true,
        messageId: response[0].headers['x-message-id'] || `sg-web-${Date.now()}`,
      };
    } catch (error) {
      logger.error('Failed to send email via SendGrid Web API', {
        error: error instanceof Error ? error.message : 'Unknown error',
        to: options.to,
        subject: options.subject,
        apiKey: this.apiKey ? 'Present' : 'Missing',
        fromEmail: this.fromEmail,
        fromName: this.fromName,
        sendGridError: error instanceof Error && 'response' in error ? {
          statusCode: (error as any).response?.statusCode,
          body: (error as any).response?.body,
        } : null,
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
