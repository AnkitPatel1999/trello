import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { sendOtp } from '../store/authSlice';
import EmailLogin from '../components/auth/EmailLogin';
import OTPVerification from '../components/auth/OTPVerification';

const LoginPage = () => {
  console.log('LoginPage rendering');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showOtp, setShowOtp] = useState(false);

  const handleOtpSent = () => {
    setShowOtp(true);
  };

  const handleBackToEmail = () => {
    setShowOtp(false);
  };

  const handleAuthSuccess = () => {
    navigate('/dashboard', { replace: true });
  };

  if (showOtp) {
    return (
      <OTPVerification
        onBack={handleBackToEmail}
        onSuccess={handleAuthSuccess}
      />
    );
  }

  return (
    <EmailLogin onOtpSent={handleOtpSent} />
  );
};

export default LoginPage;
