import { Router } from 'express';
import bookingController from '../controllers/booking.controller.js';
import verifyToken from '../middlewares/verify-token.middleware.js';
import validator from '../middlewares/validator.middleware.js';

import {
  CreateBookingSchema,
  UpdateBookingStatusSchema,
} from '../schemas/booking.schema.js';

const bookingRouter = Router();

/**
 * @typedef {object} Bookings
 * @property {string} _id
 * @property {string} dogCategory
 * @property {string} service
 * @property {number} price
 * @property {string} schedule
 * @property {string} status
 * @property {string} user
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * GET /api/bookings
 * @summary Get a list of all bookings
 * @tags Bookings
 * @security JWT
 * @return {array<Bookings>} 200 - A list of all bookings
 */
bookingRouter.get('/', verifyToken, bookingController.findAll);

/**
 * GET /api/bookings/schedules
 * @summary Get a list of all scheduled bookings
 * @tags Bookings
 * @security JWT
 * @return {array<Bookings>} 200 - A list of scheduled bookings
 */
bookingRouter.get('/schedules', verifyToken, bookingController.schedules);

/**
 * GET /api/bookings/paginate
 * @summary Get bookings with pagination
 * @tags Bookings
 * @security JWT
 * @return {array<Bookings>} 200 - Paginated list of bookings
 */
bookingRouter.get('/paginate', verifyToken, bookingController.paginate);

/**
 * GET /api/bookings/{bookingId}
 * @summary Get a single booking by ID
 * @tags Bookings
 * @security JWT
 * @param {string} bookingId.path.required - The booking ID
 * @return {Bookings} 200 - The details of a single booking
 */
bookingRouter.get('/:bookingId', verifyToken, bookingController.findBooking);

/**
 * @typedef {object} CreateBooking
 * @property {string} dogCategory.required
 * @property {string} service.required
 * @property {number} price.required
 * @property {string} schedule.required
 */

/**
 * POST /api/bookings
 * @summary Create a new booking
 * @tags Bookings
 * @security JWT
 * @param {CreateBooking} request.body.required - The details of the booking to create
 * @return {Bookings} 201 - The newly created booking
 */
bookingRouter.post(
  '/',
  validator(CreateBookingSchema),
  verifyToken,
  bookingController.create,
);

/**
 * @typedef {object} UpdateBookingStatus
 * @property {string} status.required
 */

/**
 * PUT /api/bookings/{bookingId}/status
 * @summary Update the status of a booking
 * @tags Bookings
 * @security JWT
 * @param {string} bookingId.path.required - The booking ID
 * @param {UpdateBookingStatus} request.body.required - The new status for the booking
 * @return {Bookings} 200 - The updated booking
 */
bookingRouter.put(
  '/:bookingId/status',
  validator(UpdateBookingStatusSchema),
  verifyToken,
  bookingController.updateStatus,
);

/**
 * DELETE /api/bookings/{bookingId}
 * @summary Delete a booking
 * @tags Bookings
 * @security JWT
 * @param {string} bookingId.path.required - The booking ID
 * @return {string} 200 - Booking successfully deleted
 */
bookingRouter.delete('/:bookingId', verifyToken, bookingController.delete);

export default bookingRouter;
