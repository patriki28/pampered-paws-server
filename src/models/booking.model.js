import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    dogCategory: {
      type: String,
      trim: true,
      required: [true, 'Dog Category is required.'],
    },
    service: {
      type: String,
      trim: true,
      required: [true, 'Service is required.'],
    },
    price: {
      type: Number,
      trim: true,
      required: [true, 'Price is required.'],
    },
    schedule: {
      type: Date,
      trim: true,
      required: [true, 'Schedule is required.'],
    },
    status: {
      type: String,
      trim: true,
      default: 'pending',
      required: [true, 'Status is required.'],
      enum: ['pending', 'confirmed', 'completed', 'rejected'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      trim: true,
      required: [true, 'User is required.'],
    },
  },
  {
    timestamps: true,
  },
  { versionKey: false },
);

BookingSchema.pre('save', async function (next) {
  const booking = this;

  // Check if the user has more than 5 pending or confirmed bookings
  const pendingConfirmedBookingsCount =
    await mongoose.models.Booking.countDocuments({
      user: booking.user,
      status: { $in: ['pending', 'confirmed'] },
    });

  if (pendingConfirmedBookingsCount >= 5) {
    return next(
      new Error('You cannot have more than 5 pending or confirmed bookings.'),
    );
  }
});

const Booking = mongoose.model('Booking', BookingSchema);

export default Booking;
