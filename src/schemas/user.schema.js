import { z } from 'zod';

export const RegisterUserSchema = z.object({
  body: z.object({
    firstName: z
      .string({
        required_error: 'First name is required',
        invalid_type_error: 'First name must be a string',
      })
      .trim()
      .min(2, { message: 'First name must be at least 2 characters long' })
      .max(50, { message: 'First name must be less than 50 characters' }),
    middleName: z
      .string({
        invalid_type_error: 'Middle name must be a string',
      })
      .trim()
      .min(2, { message: 'Middle name must be at least 2 characters long' })
      .max(50, { message: 'Middle name must be less than 50 characters' })
      .optional(),
    lastName: z
      .string({
        required_error: 'Last name is required',
        invalid_type_error: 'Last name must be a string',
      })
      .trim()
      .min(2, { message: 'Last name must be at least 2 characters long' })
      .max(50, { message: 'Last name must be less than 50 characters' }),
    phoneNumber: z
      .string({
        required_error: 'Phone Number is required',
        invalid_type_error: 'Phone Number must be a string',
      })
      .trim()
      .regex(/^09\d{9}$/, {
        message: 'Phone Number must start with "09" and be 11 digits long',
      }),
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

export const UpdateUserSchema = z.object({
  body: z.object({
    firstName: z
      .string({
        required_error: 'First name is required',
        invalid_type_error: 'First name must be a string',
      })
      .trim()
      .min(2, { message: 'First name must be at least 2 characters long' })
      .max(50, { message: 'First name must be less than 50 characters' }),
    middleName: z
      .string({
        invalid_type_error: 'Middle name must be a string',
      })
      .trim()
      .min(2, { message: 'Middle name must be at least 2 characters long' })
      .max(50, { message: 'Middle name must be less than 50 characters' })
      .optional(),
    lastName: z
      .string({
        required_error: 'Last name is required',
        invalid_type_error: 'Last name must be a string',
      })
      .trim()
      .min(2, { message: 'Last name must be at least 2 characters long' })
      .max(50, { message: 'Last name must be less than 50 characters' }),
  }),
});
