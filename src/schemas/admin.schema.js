import { z } from 'zod';

export const RegisterAdminSchema = z.object({
  body: z.object({
    username: z
      .string({
        required_error: 'Username is required',
        invalid_type_error: 'Username must be a string',
      })
      .trim()
      .min(2, { message: 'Username must be at least 2 characters long' })
      .max(50, { message: 'Username must be less than 50 characters' }),
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

export const UpdateAdminSchema = z.object({
  body: z.object({
    username: z
      .string({
        required_error: 'Username is required',
        invalid_type_error: 'Username must be a string',
      })
      .trim()
      .min(2, { message: 'Username must be at least 2 characters long' })
      .max(50, { message: 'Username must be less than 50 characters' }),
  }),
});
