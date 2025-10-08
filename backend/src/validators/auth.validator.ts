import Joi from 'joi';

export const authValidator = {
  sendOtp: Joi.object({
    email: Joi.string().email().required(),
  }),

  verifyOtp: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).pattern(/^\d{6}$/).required(),
  }),
};
