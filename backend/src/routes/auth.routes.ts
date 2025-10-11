import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { authValidator } from '../validators/auth.validator';

const router = Router();
const authController = new AuthController();

// Send OTP
router.post(
  '/send-otp',
  validationMiddleware(authValidator.sendOtp),
  authController.sendOtp
);

// Verify OTP
router.post(
  '/verify-otp',
  validationMiddleware(authValidator.verifyOtp),
  authController.verifyOtp
);

// Logout
router.post('/logout', authController.logout);

// Verify Super User Password
router.post('/verify-super-user', authController.verifySuperUserPassword);

export { router as authRoutes };
