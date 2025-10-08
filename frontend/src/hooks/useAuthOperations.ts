import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendOtp, verifyOtp, clearError } from '../store/authSlice';

export const useAuthOperations = () => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendOtp = async (email: string) => {
    try {
      setIsSubmitting(true);
      dispatch(clearError());
      const result = await dispatch(sendOtp(email) as any);
      
      if (result.type.endsWith('/fulfilled')) {
        return { success: true };
      } else {
        return { success: false, error: result.payload || 'Failed to send OTP' };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (email: string, otp: string) => {
    try {
      setIsSubmitting(true);
      dispatch(clearError());
      const result = await dispatch(verifyOtp({ email, otp }) as any);
      
      if (result.type.endsWith('/fulfilled')) {
        return { success: true };
      } else {
        return { success: false, error: result.payload || 'Verification failed' };
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
