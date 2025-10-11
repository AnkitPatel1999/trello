import { Status } from './status';

export interface Card {
  id: string;
  title: string;
  description?: string;
  subtitles?: string[];
  status: Status;
  projectId: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  createdBy?: string; // Add this field
}


