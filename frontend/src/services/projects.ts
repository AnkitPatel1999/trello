import { apiService } from './api';
import type { Project, CreateProjectRequest } from '../domain/project';

class ProjectService {
  async getProjects(): Promise<Project[]> {
    try {
      return await apiService.getProjects();
    } catch (error: any) {
      console.error('Get projects error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch projects');
    }
  }

  async getProject(id: string): Promise<Project> {
    try {
      return await apiService.getProject(id);
    } catch (error: any) {
      console.error('Get project error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch project');
    }
  }

  async createProject(project: CreateProjectRequest): Promise<Project> {
    try {
      return await apiService.createProject(project);
    } catch (error: any) {
      console.error('Create project error:', error);
      throw new Error(error.response?.data?.message || 'Failed to create project');
    }
  }

  async updateProject(id: string, project: Partial<CreateProjectRequest>): Promise<Project> {
    try {
      return await apiService.updateProject(id, project);
    } catch (error: any) {
      console.error('Update project error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update project');
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      await apiService.deleteProject(id);
    } catch (error: any) {
      console.error('Delete project error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete project');
    }
  }
}

export const projectService = new ProjectService();