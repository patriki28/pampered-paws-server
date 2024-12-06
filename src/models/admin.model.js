import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { VALID_EMAIL } from '../constants/regex.js';

const AdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
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

AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const Admin = mongoose.model('Admin', AdminSchema);

export default Admin;
