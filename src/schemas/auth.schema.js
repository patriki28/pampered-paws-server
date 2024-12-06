import { z } from 'zod';

export const LoginSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string',
      })
      .trim()
      .email({ message: 'Invalid email address' })
      .max(50, { message: 'Password must be less than 50 characters' }),
    password: z
      .string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string',
      })
      .trim()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(50, { message: 'Password must be less than 50 characters' }),
  }),
});

export const ForgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string',
      })
      .trim()
      .email({ message: 'Invalid email address' })
      .max(50, { message: 'Password must be less than 50 characters' }),
  }),
});

export const ResetPasswordSchema = z.object({
  params: z.object({
    token: z
      .string({
        required_error: 'Token is required',
        invalid_type_error: 'Token must be a string',
      })
      .trim(),
  }),
  body: z.object({
    password: z
      .string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string',
      })
      .trim()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(50, { message: 'Password must be less than 50 characters' }),
  }),
});

export const ChangePasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string({
        required_error: 'Current Password is required',
        invalid_type_error: 'Current Password must be a string',
      })
      .trim()
      .min(8, {
        message: 'Current Password must be at least 8 characters long',
      })
      .max(50, { message: 'Current Password must be less than 50 characters' }),
    newPassword: z
      .string({
        required_error: 'New Password is required',
        invalid_type_error: 'New Password must be a string',
      })
      .trim()
      .min(8, { message: 'New Password must be at least 8 characters long' })
      .max(50, { message: 'New Password must be less than 50 characters' }),
  }),
});
