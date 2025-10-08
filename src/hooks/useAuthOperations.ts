import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendOtp, verifyOtp } from '../store/authSlice';
import { useAuth } from './useAuth';

export const useAuthOperations = () => {
  const dispatch = useDispatch();
  const { login, clearError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendOtp = async (email: string) => {
    try {
      setIsSubmitting(true);
      clearError();
      await dispatch(sendOtp(email) as any);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (email: string, otp: string) => {
    try {
      setIsSubmitting(true);
      clearError();
      const result = await dispatch(verifyOtp(email, otp) as any);
      
      if (result.payload?.success && result.payload?.user && result.payload?.token) {
        login(result.payload.user, result.payload.token);
        return { success: true };
      } else {
        return { success: false, error: result.payload?.message || 'Verification failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    sendOtp: handleSendOtp,
    verifyOtp: handleVerifyOtp,
    isSubmitting,
  };
};
