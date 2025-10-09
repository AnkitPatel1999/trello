import { apiService } from './api';
import type { AuthResponse } from '../domain/auth';

class AuthService {
  async sendOtp(email: string): Promise<AuthResponse> {
    return await apiService.sendOtp(email);
  }

  async verifyOtp(email: string, otp: string): Promise<AuthResponse> {
    return await apiService.verifyOtp(email, otp);
  }

  async logout(): Promise<void> {
    await apiService.logout();
  }

  getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getStoredUser(): any | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  storeAuthData(token: string, user: any): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
}

export const authService = new AuthService();
