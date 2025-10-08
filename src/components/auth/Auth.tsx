import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import EmailLogin from './EmailLogin';
import OTPVerification from './OTPVerification';

interface AuthProps {
  onAuthSuccess: () => void;
}

const Auth = ({ onAuthSuccess }: AuthProps) => {
  const { otpSent } = useSelector((state: RootState) => state.auth);
  const [showOtp, setShowOtp] = useState(otpSent);

  const handleOtpSent = () => {
    setShowOtp(true);
  };

  const handleBackToEmail = () => {
    setShowOtp(false);
  };

  const handleAuthSuccess = () => {
    onAuthSuccess();
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

export default Auth;
