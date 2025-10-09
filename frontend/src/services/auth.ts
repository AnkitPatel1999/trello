import { apiService } from './api';
import type { AuthResponse } from '../domain/auth';

class AuthService {
  async sendOtp(email: string): Promise<AuthResponse> {
    try {
      return await apiService.sendOtp(email);
    } catch (error: any) {
      console.error('Send OTP error:', error);
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  }

  async verifyOtp(email: string, otp: string): Promise<AuthResponse> {
    try {
      const response = await apiService.verifyOtp(email, otp);
      
      // Transform the response to match expected structure
      const transformedResponse: AuthResponse = {
        success: response.success,
        message: response.message,
        user: response.data?.user,
        token: response.data?.token
      };
      
      // Store auth data if successful
      if (transformedResponse.success && transformedResponse.token && transformedResponse.user) {
        this.storeAuthData(transformedResponse.token, transformedResponse.user);
      }
      
      return transformedResponse;
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      throw new Error(error.response?.data?.message || 'Invalid OTP');
    }
  }

  async logout(): Promise<void> {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthData();
    }
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
