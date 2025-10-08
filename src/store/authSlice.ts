import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../domain/auth';
import { authService } from '../services/auth';

const initialState: AuthState = {
  user: authService.getStoredUser(),
  isAuthenticated: !!authService.getStoredToken(),
  isLoading: false,
  error: null,
  otpSent: false,
  email: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setOtpSent(state, action: PayloadAction<{ email: string }>) {
      state.otpSent = true;
      state.email = action.payload.email;
      state.error = null;
    },
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
});

export const {
  setLoading,
  setError,
  setOtpSent,
  setUser,
  logout,
  clearError,
  resetOtpState,
} = authSlice.actions;

// Async thunks
export const sendOtp = (email: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const response = await authService.sendOtp(email);
    
    if (response.success) {
      dispatch(setOtpSent({ email }));
    } else {
      dispatch(setError(response.message));
    }
  } catch (error: any) {
    dispatch(setError(error.message || 'Failed to send OTP'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const verifyOtp = (email: string, otp: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const response = await authService.verifyOtp(email, otp);
    
    if (response.success && response.user && response.token) {
      authService.storeAuthData(response.token, response.user);
      dispatch(setUser(response.user));
    } else {
      dispatch(setError(response.message || 'Invalid OTP'));
    }
  } catch (error: any) {
    dispatch(setError(error.message || 'Failed to verify OTP'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const logoutUser = () => async (dispatch: any) => {
  try {
    await authService.logout();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    dispatch(logout());
  }
};

export default authSlice.reducer;
