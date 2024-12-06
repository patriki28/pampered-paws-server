import User from '../models/user.model.js';
import Booking from '../models/booking.model.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import generateVerificationToken from '../utils/generate-verification-token.js';

const TOKEN_EXPIRATION_TIME = 15 * 60 * 1000; // 15 minutes

const UserService = {
  async register(
    firstName,
    middleName,
    lastName,
    phoneNumber,
    email,
    password,
  ) {
    const userExists = await User.findOne({ email }).select('_id');

    if (userExists) {
      throw new Error(
        'A user with this email already exists. Please use a different email.',
      );
    }

    const user = new User({
      firstName,
      middleName,
      lastName,
      phoneNumber,
      email,
      password,
      verificationToken: generateVerificationToken(),
      verificationTokenExpiresAt: Date.now() + TOKEN_EXPIRATION_TIME,
    });

    await user.save();

    return {
      _id: user._id,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      verificationToken: user.verificationToken,
    };
  },

  async verifyEmail(code) {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    }).select(
      '_id email lastName isVerified verificationToken verificationTokenExpiresAt',
    );

    if (!user) {
      throw new Error('The verification code is invalid or has expired.');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    return { email: admin.email, lastName: admin.lastName };
  },

  async login(email, password) {
    const user = await User.findOne({ email }).select(
      '_id firstName middleName lastName email phoneNumber isVerified password verificationToken verificationTokenExpiresAt',
    );

    if (!user) {
      throw new Error('Invalid credentials.');
    }

    if (!user.isVerified) {
      user.verificationToken = generateVerificationToken();
      user.verificationTokenExpiresAt = Date.now() + TOKEN_EXPIRATION_TIME;

      await user.save();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials.');
    }

    return {
      _id: user._id,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      isVerified: user.isVerified,
      verificationToken: user.verificationToken,
    };
  },

  async sendPasswordResetLink(email) {
    const user = await User.findOne({ email }).select(
      '_id email resetPasswordToken resetPasswordExpiresAt',
    );

    if (!user) {
      throw new Error('No user found with this email.');
    }

    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpiresAt = Date.now() + TOKEN_EXPIRATION_TIME;

    await user.save();

    return { email: user.email, resetPasswordToken: user.resetPasswordToken };
  },

  async resetPassword(token, password) {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    }).select('_id email password resetPasswordToken resetPasswordExpiresAt');

    if (!user) {
      throw new Error('The password reset token is invalid or has expired.');
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    return { email: user.email };
  },

  async findUserById(userId) {
    const user = await User.findById(userId).select(
      '_id firstName middleName lastName email phoneNumber isVerified',
    );

    if (!user) {
      throw new Error('User not found.');
    }

    if (!user.isVerified) {
      throw new Error('User is not verified.');
    }

    return {
      _id: user._id,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
    };
  },

  async updateProfile(userId, firstName, middleName, lastName) {
    const user = await User.findById(userId).select(
      '_id firstName middleName lastName email phoneNumber isVerified',
    );

    if (!user) {
      throw new Error('User not found.');
    }

    if (!user.isVerified) {
      throw new Error('User is not verified.');
    }

    user.firstName = firstName;
    user.middleName = middleName;
    user.lastName = lastName;

    await user.save();

    return {
      _id: user._id,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
    };
  },

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('_id password isVerified');

    if (!user) {
      throw new Error('User not found.');
    }

    if (!user.isVerified) {
      throw new Error('User is not verified.');
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new Error('Invalid credentials.');
    }

    user.password = newPassword;

    await user.save();

    return;
  },

  async bookings(userId) {
    const bookings = await Booking.find({ user: userId })
      .select('_id dogCategory service price schedule status user')
      .sort({ createdAt: -1 });

    return bookings;
  },

  async schedules(userId) {
    const bookings = await Booking.find({
      user: userId,
      status: 'confirmed',
    }).sort({ createdAt: -1 });

    const formattedSchedules = bookings.map((booking) => {
      return {
        event_id: booking._id,
        title: `${booking.service} || ${booking.dogCategory}`,
        start: booking.schedule,
        end: new Date(booking.schedule.getTime() + 2 * 60 * 60 * 1000),
      };
    });

    return formattedSchedules;
  },
};

export default UserService;
