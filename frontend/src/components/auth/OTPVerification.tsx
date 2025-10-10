import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sendOtp, verifyOtp } from '../../store/authSlice';
import type { RootState } from '../../store';
import './auth.css';

interface OTPVerificationProps {
  onBack: () => void;
  onSuccess: () => void;
}

const OTPVerification = ({ onBack, onSuccess }: OTPVerificationProps) => {
  const dispatch = useDispatch();
  const { error, email, isLoading } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || '';
    }
    
    setOtp(newOtp);
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex(digit => !digit);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6 || !email) {
      return;
    }

    try {
      const result = await dispatch(verifyOtp({ email, otp: otpString }) as any);
      
      if (verifyOtp.fulfilled.match(result)) {
        // Simple redirect to dashboard
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
    }
  };

  const handleBack = () => {
    onBack();
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      await dispatch(sendOtp(email) as any);
    } catch (error) {
      console.error('Resend OTP failed:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Verify Your Email</h1>
          <p className="auth-subtitle">
            We've sent a 6-digit code to <strong>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label className="auth-label">Enter Verification Code</label>
            <div className="otp-input-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="otp-input"
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={otp.join('').length !== 6 || isLoading}
            className="auth-button"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Didn't receive the code?{' '}
            <button
              type="button"
              onClick={handleResend}
              className="auth-link-button"
              disabled={isLoading}
            >
              Resend
            </button>
          </p>
          <button
            type="button"
            onClick={handleBack}
            className="auth-back-button"
            disabled={isLoading}
          >
            ← Back to Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
