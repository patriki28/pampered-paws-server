import asyncHandler from 'express-async-handler';
import BookingService from '../services/booking.service.js';

const BookingController = {
  create: asyncHandler(async (req, res) => {
    const { dogCategory, service, price, schedule } = req.body;

    const booking = await BookingService.create(
      dogCategory,
      service,
      price,
      schedule,
      req.userId,
    );

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking,
    });
  }),

  findAll: asyncHandler(async (req, res) => {
    const bookings = await BookingService.findAll();

    res.status(200).json({
      success: true,
      bookings,
    });
  }),

  schedules: asyncHandler(async (req, res) => {
    const bookings = await BookingService.schedules();

    res.status(200).json({
      success: true,
      bookings,
    });
  }),

  paginate: asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const { bookings, totalBookings, totalPages, currentPage } =
      await BookingService.paginateBookings(parseInt(page), parseInt(limit));

    res.status(200).json({
      success: true,
      bookings,
      totalBookings,
      totalPages,
      currentPage,
    });
  }),

  findBooking: asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    const booking = await BookingService.findBooking(bookingId);

    res.status(200).json({ success: true, booking });
  }),

  updateStatus: asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await BookingService.updateStatus(bookingId, status);

    res.status(200).json({
      success: true,
      message: 'Updated status successfully',
      booking,
    });
  }),

  delete: asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    await BookingService.delete(bookingId);

    res
      .status(200)
      .json({ success: true, message: 'Booking deleted successfully' });
  }),
};

export default BookingController;
