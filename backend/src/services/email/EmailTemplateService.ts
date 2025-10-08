import Handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { IRenderedEmailTemplate, IEmailTemplateData } from '../../interfaces/IEmailTemplate';
import { logger } from '../../utils/logger';

export class EmailTemplateService {
  private templateCache: Map<string, HandlebarsTemplateDelegate> = new Map();
  private templateDir: string;

  constructor() {
    this.templateDir = path.join(process.cwd(), 'src', 'templates', 'email');
    this.registerHelpers();
  }

  private registerHelpers(): void {
    // Date formatting helper
    Handlebars.registerHelper('formatDate', (date: Date, format: string = 'MMMM DD, YYYY') => {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(date));
    });

    // Time formatting helper
    Handlebars.registerHelper('formatTime', (date: Date) => {
      return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(new Date(date));
    });

    // Relative time helper
    Handlebars.registerHelper('timeAgo', (date: Date) => {
      const now = new Date();
      const diff = now.getTime() - new Date(date).getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (minutes < 1) return 'just now';
      if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      return `${days} day${days > 1 ? 's' : ''} ago`;
    });

    // Capitalize helper
    Handlebars.registerHelper('capitalize', (str: string) => {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    });

    // Conditional helper
    Handlebars.registerHelper('ifEquals', (arg1: any, arg2: any, options: any) => {
      return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    });

    // Loop helper with index
    Handlebars.registerHelper('eachWithIndex', (array: any[], options: any) => {
      let result = '';
      for (let i = 0; i < array.length; i++) {
        result += options.fn({ ...array[i], index: i });
      }
      return result;
    });
  }

  async renderTemplate(
    templateName: string,
    data: IEmailTemplateData
  ): Promise<IRenderedEmailTemplate> {
    try {
      // Get or compile template
      const template = await this.getTemplate(templateName);
      
      // Render HTML
      const html = template(data);
      
      // Generate text version (simple HTML to text conversion)
      const text = this.htmlToText(html);
      
      return {
        subject: data.subject || 'Email from Notification Service',
        html,
        text,
      };
    } catch (error) {
      logger.error('Failed to render email template', {
        templateName,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  private async getTemplate(templateName: string): Promise<HandlebarsTemplateDelegate> {
    // Check cache first
    if (this.templateCache.has(templateName)) {
      return this.templateCache.get(templateName)!;
    }

    try {
      // Load template file
      const templatePath = path.join(this.templateDir, `${templateName}.hbs`);
      const templateSource = await fs.readFile(templatePath, 'utf-8');
      
      // Compile template
      const template = Handlebars.compile(templateSource);
      
      // Cache template
      this.templateCache.set(templateName, template);
      
      return template;
    } catch (error) {
      logger.error('Failed to load email template', {
        templateName,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  private htmlToText(html: string): string {
    // Simple HTML to text conversion
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  }

  async clearCache(): Promise<void> {
    this.templateCache.clear();
    logger.info('Email template cache cleared');
  }

  async preloadTemplates(templateNames: string[]): Promise<void> {
    const promises = templateNames.map(name => this.getTemplate(name));
    await Promise.all(promises);
    logger.info('Email templates preloaded', { count: templateNames.length });
  }
}
