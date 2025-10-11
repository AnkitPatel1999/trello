import axios from 'axios';
import { logger } from '../../utils/logger';

export interface ISendGridEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from: string;
}

export interface ISendGridResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class SendGridApiService {
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    this.apiKey = process.env.SENDGRID_API_KEY || '';
    this.fromEmail = process.env.SENDGRID_FROM_EMAIL || '';
    this.fromName = process.env.SENDGRID_FROM_NAME || 'Notification Service';
  }

  async sendEmail(options: ISendGridEmailOptions): Promise<ISendGridResult> {
    try {
      if (!this.apiKey) {
        throw new Error('SendGrid API key not configured');
      }

      const payload = {
        personalizations: [
          {
            to: [{ email: options.to }],
            subject: options.subject,
          },
        ],
        from: {
          email: this.fromEmail,
          name: this.fromName,
        },
        content: [
          {
            type: 'text/html',
            value: options.html,
          },
        ],
      };

      // Add text content if provided
      if (options.text) {
        payload.content.push({
          type: 'text/plain',
          value: options.text,
        });
      }

      const response = await axios.post(
        'https://api.sendgrid.com/v3/mail/send',
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 second timeout
        }
      );

      logger.info('Email sent successfully via SendGrid API', {
        to: options.to,
        subject: options.subject,
        status: response.status,
      });

      return {
        success: true,
        messageId: response.headers['x-message-id'] || `sg-${Date.now()}`,
      };
    } catch (error) {
      logger.error('Failed to send email via SendGrid API', {
        error: error instanceof Error ? error.message : 'Unknown error',
        to: options.to,
        subject: options.subject,
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
