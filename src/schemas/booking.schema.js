import { z } from 'zod';

export const CreateBookingSchema = z.object({
  body: z.object({
    dogCategory: z
      .string({
        required_error: 'Dog category is required',
        invalid_type_error: 'Dog category must be a string',
      })
      .trim(),
    service: z
      .string({
        required_error: 'Service is required',
        invalid_type_error: 'Service must be a string',
      })
      .trim(),
    price: z
      .number({
        required_error: 'Price is required',
        invalid_type_error: 'Price must be a number',
      })
      .positive({ message: 'Price must be a positive number' }),
    schedule: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Schedule must be a valid date',
      })
      .refine(
        (val) => {
          const now = new Date();
          const minimumBookingDate = new Date(
            now.getTime() + 24 * 60 * 60 * 1000,
          );
          const scheduleDate = new Date(val);
          return scheduleDate >= minimumBookingDate;
        },
        {
          message: 'Bookings must be made at least 24 hours in advance.',
        },
      ),
  }),
});

export const UpdateBookingStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'confirmed', 'completed', 'rejected'], {
      required_error: 'Status is required',
      invalid_type_error:
        'Status must be one of [pending, confirmed, completed, rejected]',
    }),
  }),
});

export const PaginateBookingSchema = z.object({
  query: z.object({
    page: z
      .number({
        invalid_type_error: 'Page must be a number',
      })
      .positive({ message: 'Page must be a positive number' })
      .optional(),
    limit: z
      .number({
        invalid_type_error: 'Limit must be a number',
      })
      .positive({ message: 'Limit must be a positive number' })
      .optional(),
  }),
});
