import Booking from '../models/booking.model.js';

const BookingService = {
  async create(dogCategory, service, price, schedule, user) {
    // Check if the booking date is at least 24 hours from now
    const now = new Date();
    const minimumBookingDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours later

    if (schedule.getTime() < minimumBookingDate.getTime()) {
      throw new Error('Bookings must be made at least 24 hours in advance.');
    }

    const conflict = await Booking.findOne({
      user: user,
      schedule: {
        $gte: new Date(schedule.getTime() - 2 * 60 * 60 * 1000), // 2 hours before
        $lte: new Date(schedule.getTime() + 2 * 60 * 60 * 1000), // 2 hours after
      },
    });

    if (conflict) {
      throw new Error('This booking conflicts with an existing schedule.');
    }

    const booking = new Booking({
      dogCategory,
      service,
      price,
      schedule,
      user,
    });

    await booking.save();

    return booking;
  },

  async findAll() {
    const bookings = await Booking.find()
      .populate('user', 'firstName lastName phoneNumber email')
      .sort({ createdAt: -1 });

    return bookings;
  },

  async schedules() {
    const bookings = await Booking.find({ status: 'confirmed' })
      .populate('user', 'firstName lastName phoneNumber email')
      .sort({ createdAt: -1 });

    const formattedSchedules = bookings.map((booking) => {
      return {
        event_id: booking._id,
        title: `${booking.user.firstName}, ${booking.user.firstName} || ${booking.service} || ${booking.dogCategory}`,
        start: booking.schedule,
        end: new Date(booking.schedule.getTime() + 2 * 60 * 60 * 1000),
      };
    });

    return formattedSchedules;
  },

  async paginate(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const totalBookings = await Booking.countDocuments();

    const bookings = await Booking.find()
      .populate('user', 'firstName lastName phoneNumber email')
      .skip(skip)
      .limit(limit)
      .sort({ schedule: -1 });

    return {
      bookings,
      totalBookings,
      totalPages: Math.ceil(totalBookings / limit),
      currentPage: page,
    };
  },

  async findBooking(bookingId) {
    const booking = await Booking.findById(bookingId).populate(
      'user',
      'firstName lastName phoneNumber email',
    );

    if (!booking) {
      throw new Error('Booking not found');
    }

    return booking;
  },

  async updateStatus(bookingId, status) {
    const booking = await Booking.findById(bookingId).populate(
      'user',
      'firstName lastName phoneNumber email',
    );

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status === 'pending') {
      if (status !== 'confirmed' && status !== 'rejected') {
        throw new Error(
          'A pending booking can only be changed to "confirmed" or "rejected".',
        );
      }
    } else if (booking.status === 'confirmed') {
      if (status !== 'completed') {
        throw new Error(
          'A confirmed booking can only be changed to "completed".',
        );
      }
    } else if (
      booking.status === 'completed' ||
      booking.status === 'rejected'
    ) {
      throw new Error('A completed or rejected booking cannot be changed.');
    }

    booking.status = status;

    await booking.save();

    return booking;
  },

  async delete(bookingId) {
    Booking.findByIdAndDelete(bookingId);
  },
};

export default BookingService;
