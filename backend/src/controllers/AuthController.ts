import { Request, Response } from 'express';
// import * as jwt from 'jsonwebtoken';
const jwt = require('jsonwebtoken');
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { logger } from '../utils/logger';
import { Otp } from '../models/Auth.model';
import { User } from '../models/User.model';
import { generateId } from '../utils/helpers';
import { EmailService } from '../services/email/EmailService';

export class AuthController {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  sendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      ApiResponse.badRequest(res, 'Invalid email format');
      return;
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    try {
      // Delete any existing OTP for this email
      await Otp.deleteMany({ email });

      // Create new OTP
      await Otp.create({
        email,
        otp,
        expiresAt,
        attempts: 0,
        isUsed: false,
      });

      // Try to send email, fallback to logging if email service fails
      try {
        const emailResult = await this.emailService.sendEmail({
          to: email,
          subject: 'Your OTP for Login',
          template: 'otp',
          data: { otp, email }
        });

        if (emailResult.success) {
          logger.info('OTP sent successfully via email', { 
            email, 
            messageId: emailResult.messageId 
          });
        } else {
          throw new Error(emailResult.error);
        }
      } catch (emailError) {
        // Fallback: Log OTP for development/testing
        logger.warn('Email service failed, logging OTP for testing', { 
          email, 
          otp,
          error: emailError instanceof Error ? emailError.message : 'Unknown error',
          message: 'Check server logs for OTP. Configure email service for production.'
        });
      }

      ApiResponse.success(res, 'OTP sent successfully');
    } catch (error) {
      logger.error('Failed to send OTP', {
        error: error instanceof Error ? error.message : 'Unknown error',
        email,
      });
      ApiResponse.internalServerError(res, 'Failed to send OTP');
    }
  });

  verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    try {
      // Find the OTP record
      const otpRecord = await Otp.findOne({
        email,
        isUsed: false,
        expiresAt: { $gt: new Date() },
      }).sort({ createdAt: -1 });

      if (!otpRecord) {
        ApiResponse.badRequest(res, 'Invalid or expired OTP');
        return;
      }

      // Check attempts
      if (otpRecord.attempts >= 3) {
        ApiResponse.badRequest(res, 'Too many failed attempts. Please request a new OTP');
        return;
      }

      // Verify OTP
      if (otpRecord.otp !== otp) {
        otpRecord.attempts += 1;
        await otpRecord.save();
        
        ApiResponse.badRequest(res, 'Invalid OTP');
        return;
      }

      // Mark OTP as used
      otpRecord.isUsed = true;
      await otpRecord.save();

      // Find or create user
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          email,
          name: email.split('@')[0],
          lastSeen: new Date(),
          isOnline: true,
        });
      } else {
        // Update user's last seen and online status
        user.lastSeen = new Date();
        user.isOnline = true;
        await user.save();
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      logger.info('OTP verified successfully', { email, userId: user._id });

      ApiResponse.success(res, 'OTP verified successfully', {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          isVerified: true,
          createdAt: user.createdAt,
        },
        token,
      });
    } catch (error) {
      logger.error('Failed to verify OTP', {
        error: error instanceof Error ? error.message : 'Unknown error',
        email,
      });
      ApiResponse.internalServerError(res, 'Failed to verify OTP');
    }
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    // In a more sophisticated implementation, you might want to:
    // 1. Add the token to a blacklist
    // 2. Update user's online status
    // 3. Log the logout event

    ApiResponse.success(res, 'Logged out successfully');
  });
}
