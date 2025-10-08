import type { AuthResponse } from '../domain/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class AuthService {
  async sendOtp(email: string): Promise<AuthResponse> {
    try {
      // For development/demo purposes, simulate successful OTP send
      // In production, replace this with actual API call
      console.log('Sending OTP to:', email);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful response
      return {
        success: true,
        message: 'OTP sent successfully',
      };

      // Uncomment below for actual API integration:
      /*
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      return data;
      */
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  }

  async verifyOtp(email: string, otp: string): Promise<AuthResponse> {
    try {
      // For development/demo purposes, simulate OTP verification
      // In production, replace this with actual API call
      console.log('Verifying OTP:', otp, 'for email:', email);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate OTP validation (accept any 6-digit code for demo)
      if (otp.length === 6 && /^\d{6}$/.test(otp)) {
        const mockUser = {
          id: crypto.randomUUID(),
          email: email,
          name: email.split('@')[0],
          isVerified: true,
          createdAt: new Date().toISOString(),
        };
        
        const mockToken = 'mock-jwt-token-' + Date.now();
        
        return {
          success: true,
          message: 'OTP verified successfully',
          user: mockUser,
          token: mockToken,
        };
      } else {
        throw new Error('Invalid OTP format');
      }

      // Uncomment below for actual API integration:
      /*
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP');
      }

      return data;
      */
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
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
}

export const authService = new AuthService();
