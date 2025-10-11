import nodemailer from 'nodemailer';
import { logger } from '../../utils/logger';
import { EmailTemplateService } from './EmailTemplateService';

export interface IEmailOptions {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
  from?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export interface IEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class EmailService {
  private transporter!: nodemailer.Transporter;
  private templateService: EmailTemplateService;

  constructor() {
    this.templateService = new EmailTemplateService();
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    const provider = process.env.EMAIL_PROVIDER || 'sendgrid';
    const apiKey = process.env.SENDGRID_API_KEY || '';

    console.log("provider x ",provider)
    console.log("apiKey x ",apiKey)
    
    if (provider === 'sendgrid' && apiKey) {
      this.transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: 'apikey',
          pass: apiKey,
        },
        // Add timeout configuration
        connectionTimeout: 5000, // 5 seconds
        greetingTimeout: 5000,   // 5 seconds
        socketTimeout: 5000,     // 5 seconds
      });
    } else {
      // Mock transporter for testing
      console.log('Using mock email transporter - no valid SendGrid API key found');
      this.transporter = {
        sendMail: async () => ({ messageId: 'mock-id' }),
        verify: async () => true,
      } as any;
    }
  }

  async sendEmail(options: IEmailOptions): Promise<IEmailResult> {
    try {
      // Add timeout wrapper
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Email service timeout')), 8000); // 8 second timeout
      });

      const emailPromise = this.performSendEmail(options);
      
      return await Promise.race([emailPromise, timeoutPromise]);
    } catch (error) {
      logger.error('Failed to send email', {
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

  private async performSendEmail(options: IEmailOptions): Promise<IEmailResult> {
    try {
      // Render email template
      const renderedTemplate = await this.templateService.renderTemplate(
        options.template,
        options.data
      );

      console.log("process.env.SENDGRID_FROM_NAME ",process.env.SENDGRID_FROM_NAME)
      console.log("process.env.SENDGRID_FROM_EMAIL ",process.env.SENDGRID_FROM_EMAIL)
      // Prepare email options
      const mailOptions = {
        from: process.env.SENDGRID_FROM_EMAIL,
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: renderedTemplate.subject || options.subject,
        html: renderedTemplate.html,
        text: renderedTemplate.text,
        attachments: options.attachments,
      };

      console.log("mailOptions ",mailOptions)



      // Send email
      const result = await this.transporter.sendMail(mailOptions);
      console.log("result ",result)
      
      logger.info('Email sent successfully', {
        messageId: result.messageId,
        to: options.to,
        subject: options.subject,
      });

      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      logger.error('Failed to perform send email', {
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

  async sendNotificationEmail(options: Omit<IEmailOptions, 'template'>): Promise<IEmailResult> {
    return this.sendEmail({
      ...options,
      template: 'single-notification',
    });
  }

  async sendDigestEmail(options: Omit<IEmailOptions, 'template'>): Promise<IEmailResult> {
    return this.sendEmail({
      ...options,
      template: 'notification-digest',
    });
  }

  async sendWelcomeEmail(options: Omit<IEmailOptions, 'template'>): Promise<IEmailResult> {
    return this.sendEmail({
      ...options,
      template: 'welcome',
    });
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      logger.info('Email service connection verified');
      return true;
    } catch (error) {
      logger.error('Email service connection failed', error);
      return false;
    }
  }

  async getDeliveryStatus(messageId: string): Promise<any> {
    // This would integrate with the email provider's API to get delivery status
    // For now, we'll return a mock response
    return {
      status: 'delivered',
      deliveredAt: new Date(),
      openedAt: null,
      clickedAt: null,
    };
  }
}
