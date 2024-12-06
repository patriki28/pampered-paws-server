import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { VALID_EMAIL, VALID_PHONE_NUMBER } from '../constants/regex.js';

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, 'First name is required.'],
    },
    middleName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, 'Last name is required.'],
    },
    phoneNumber: {
      type: String,
      trim: true,
      required: [true, 'Phone number is required.'],
      match: [
        VALID_PHONE_NUMBER,
        'Please enter a valid phone number. It should start with 09 and must be 11 digits.',
      ],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Email is required.'],
      match: [VALID_EMAIL, 'Please enter a valid email address.'],
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'Password is required.'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  {
    timestamps: true,
  },
  { versionKey: false },
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', UserSchema);

export default User;
