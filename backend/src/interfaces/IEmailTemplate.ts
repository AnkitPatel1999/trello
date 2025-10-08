export interface IEmailTemplate {
  _id?: string;
  name: string;
  subject: string;
  htmlTemplate: string;
  textTemplate?: string;
  variables: string[];
  category: 'notification' | 'digest' | 'system' | 'marketing';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateEmailTemplateRequest {
  name: string;
  subject: string;
  htmlTemplate: string;
  textTemplate?: string;
  variables: string[];
  category: 'notification' | 'digest' | 'system' | 'marketing';
  isActive?: boolean;
}

export interface IUpdateEmailTemplateRequest {
  name?: string;
  subject?: string;
  htmlTemplate?: string;
  textTemplate?: string;
  variables?: string[];
  category?: 'notification' | 'digest' | 'system' | 'marketing';
  isActive?: boolean;
}

export interface IEmailTemplateData {
  [key: string]: any;
}

export interface IRenderedEmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export interface IEmailTemplateVariables {
  // User variables
  userName: string;
  userEmail: string;
  
  // Notification variables
  notificationTitle: string;
  notificationMessage: string;
  notificationType: string;
  
  // App variables
  appName: string;
  appUrl: string;
  unsubscribeUrl: string;
  
  // Custom variables
  [key: string]: any;
}
