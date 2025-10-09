import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendOtp } from '../../store/authSlice';
import type { RootState } from '../../store';
import './auth.css';

interface EmailLoginProps {
  onOtpSent: () => void;
}

const EmailLogin = ({ onOtpSent }: EmailLoginProps) => {
  const dispatch = useDispatch();
  const { error, isLoading } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      return;
    }

    try {
      const result = await dispatch(sendOtp(email.trim()));
      if (sendOtp.fulfilled.match(result)) {
        onOtpSent();
      }
    } catch (error) {
      console.error('Send OTP failed:', error);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Enter your email to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label htmlFor="email" className="auth-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="auth-input"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!isValidEmail(email) || isLoading}
            className="auth-button"
          >
            {isLoading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            We'll send you a verification code to your email
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailLogin;
