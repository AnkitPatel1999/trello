import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../domain/auth';
import { authService } from '../services/auth';

// Async thunks for better error handling
export const sendOtpThunk = createAsyncThunk(
  'auth/sendOtp',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authService.sendOtp(email);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send OTP');
    }
  }
);

export const verifyOtpThunk = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOtp(email, otp);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to verify OTP');
    }
  }
);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
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
      // Send OTP
      .addCase(sendOtpThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOtpThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpSent = true;
        state.email = action.meta.arg;
        state.error = null;
      })
      .addCase(sendOtpThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Verify OTP
      .addCase(verifyOtpThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success && action.payload.user && action.payload.token) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.otpSent = false;
          state.email = null;
          state.error = null;
        } else {
          state.error = action.payload.message || 'Verification failed';
        }
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setLoading,
  setError,
  setUser,
  logout,
  clearError,
  resetOtpState,
} = authSlice.actions;

// Export async thunks
export { sendOtpThunk as sendOtp, verifyOtpThunk as verifyOtp };

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
