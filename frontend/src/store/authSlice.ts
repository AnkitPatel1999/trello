import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../domain/auth';
import { authService } from '../services/auth';

// Async thunks
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (email: string, { rejectWithValue }) => {
    try {
      return await authService.sendOtp(email);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send OTP');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      return await authService.verifyOtp(email, otp);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to verify OTP');
    }
  }
);

// Initialize state from localStorage
const getInitialAuthState = (): AuthState => {
  try {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('auth_token');
    
    if (storedUser && storedToken) {
      return {
        user: JSON.parse(storedUser),
        isAuthenticated: true,
        isLoading: false,
        error: null,
        otpSent: false,
        email: null,
      };
    }
  } catch (error) {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  }
  
  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    otpSent: false,
    email: null,
  };
};

const initialState: AuthState = getInitialAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      state.otpSent = false;
      state.email = null;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.otpSent = false;
      state.email = null;
    },
    clearError(state) {
      state.error = null;
    },
    resetOtpState(state) {
      state.otpSent = false;
      state.email = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpSent = true;
        state.email = action.meta.arg;
        state.error = null;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success && action.payload.user && action.payload.token) {
          localStorage.setItem('user', JSON.stringify(action.payload.user));
          localStorage.setItem('auth_token', action.payload.token);
          
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.otpSent = false;
          state.email = null;
          state.error = null;
        } else {
          state.error = action.payload.message || 'Verification failed';
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, logout, clearError, resetOtpState } = authSlice.actions;
export default authSlice.reducer;
