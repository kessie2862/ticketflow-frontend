import { z } from 'zod';

const phoneRegex = /^\+?[0-9]{10,15}$/;

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone_number: z.string().regex(phoneRegex, 'Invalid phone number format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['EMPLOYEE', 'SUPPORT', 'ADMIN'], {
    message: 'Please select a valid role',
  }),
});

export const verifyOtpSchema = z.object({
  otp_code: z.string().length(6, 'OTP must be exactly 6 digits'),
});

export const forgotPasswordSchema = z.object({
  phone_number: z.string().regex(phoneRegex, 'Invalid phone number format'),
});

export const resetPasswordSchema = z.object({
  otp_code: z.string().length(6, 'OTP must be exactly 6 digits'),
  new_password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Type inference
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type VerifyOtpData = z.infer<typeof verifyOtpSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
