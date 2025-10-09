import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { AuthResponse } from '../domain/auth';
import type { Project, CreateProjectRequest } from '../domain/project';
import type { Card } from '../domain/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth APIs
  async sendOtp(email: string): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/send-otp', { email });
    return response.data;
  }

  async verifyOtp(email: string, otp: string): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/verify-otp', { email, otp });
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  // Project APIs
  async getProjects(): Promise<Project[]> {
    const response: AxiosResponse<{ data: Project[] }> = await this.api.get('/projects');
    return response.data.data;
  }

  async getProject(id: string): Promise<Project> {
    const response: AxiosResponse<{ data: Project }> = await this.api.get(`/projects/${id}`);
    return response.data.data;
  }

  async createProject(project: CreateProjectRequest): Promise<Project> {
    const response: AxiosResponse<{ data: Project }> = await this.api.post('/projects', project);
    return response.data.data;
  }

  async updateProject(id: string, project: Partial<CreateProjectRequest>): Promise<Project> {
    const response: AxiosResponse<{ data: Project }> = await this.api.put(`/projects/${id}`, project);
    return response.data.data;
  }

  async deleteProject(id: string): Promise<void> {
    await this.api.delete(`/projects/${id}`);
  }

  // Task APIs
  async getTasks(): Promise<Card[]> {
    const response: AxiosResponse<{ data: Card[] }> = await this.api.get('/tasks');
    return response.data.data;
  }

  async getTask(id: string): Promise<Card> {
    const response: AxiosResponse<{ data: Card }> = await this.api.get(`/tasks/${id}`);
    return response.data.data;
  }

  async createTask(task: Omit<Card, 'id'>): Promise<Card> {
    const response: AxiosResponse<{ data: Card }> = await this.api.post('/tasks', task);
    return response.data.data;
  }

  async updateTask(id: string, task: Partial<Omit<Card, 'id'>>): Promise<Card> {
    const response: AxiosResponse<{ data: Card }> = await this.api.put(`/tasks/${id}`, task);
    return response.data.data;
  }

  async deleteTask(id: string): Promise<void> {
    await this.api.delete(`/tasks/${id}`);
  }
}

export const apiService = new ApiService();
