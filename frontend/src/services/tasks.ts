import { apiService } from './api';
import type { Card } from '../domain/types';

class TaskService {
  async getTasks(): Promise<Card[]> {
    try {
      return await apiService.getTasks();
    } catch (error: any) {
      console.error('Get tasks error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }

  async getTask(id: string): Promise<Card> {
    try {
      return await apiService.getTask(id);
    } catch (error: any) {
      console.error('Get task error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch task');
    }
  }

  async createTask(task: Omit<Card, 'id'>): Promise<Card> {
    try {
      return await apiService.createTask(task);
    } catch (error: any) {
      console.error('Create task error:', error);
      throw new Error(error.response?.data?.message || 'Failed to create task');
    }
  }

  async updateTask(id: string, task: Partial<Omit<Card, 'id'>>): Promise<Card> {
    try {
      return await apiService.updateTask(id, task);
    } catch (error: any) {
      console.error('Update task error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update task');
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      await apiService.deleteTask(id);
    } catch (error: any) {
      console.error('Delete task error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete task');
    }
  }
}

export const taskService = new TaskService();
