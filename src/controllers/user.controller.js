import asyncHandler from 'express-async-handler';
import UserService from '../services/user.service.js';
import generateToken from '../utils/generate-token.js';
import { CLIENT_URL } from '../configs/env.config.js';
import {
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from '../lib/mailtrap/email.js';

const UserController = {
  register: asyncHandler(async (req, res) => {
    const { firstName, middleName, lastName, phoneNumber, email, password } =
      req.body;

    const user = await UserService.register(
      firstName,
      middleName,
      lastName,
      phoneNumber,
      email,
      password,
    );

    await sendVerificationEmail(user.email, user.verificationToken);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        _id: user._id,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email,
      },
    });
  }),

  verifyEmail: asyncHandler(async (req, res) => {
    const { code } = req.body;
    const user = await UserService.verifyEmail(code);

    await sendWelcomeEmail(user.email, user.lastName);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  }),

  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserService.login(email, password);

    generateToken(res, user._id);

    if (!user.isVerified) {
      await sendVerificationEmail(admin.email, admin.verificationToken);

      throw new Error(
        `User is not verified. A verification email has been sent. Please check your email.`,
      );
    }

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      user: {
        _id: user._id,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email,
      },
    });
  }),

  forgotPassword: asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await UserService.sendPasswordResetLink(email);

    await sendPasswordResetEmail(
      user.email,
      `${CLIENT_URL}/reset-password/${user.resetPasswordToken}`,
    );

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email',
    });
  }),

  resetPassword: asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await UserService.resetPassword(token, password);

    await sendPasswordResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: 'Password reset successful' });
  }),

  profile: asyncHandler(async (req, res) => {
    const user = await UserService.findUserById(req.userId);

    res.status(200).json({ success: true, user });
  }),

  updateProfile: asyncHandler(async (req, res) => {
    const { firstName, middleName, lastName } = req.body;

    const user = await UserService.updateProfile(
      req.userId,
      firstName,
      middleName,
      lastName,
    );

    res
      .status(200)
      .json({ success: true, message: 'Updated profile successfully', user });
  }),

  changePassword: asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    await UserService.changePassword(req.userId, currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: 'Changed password successfully',
    });
  }),

  bookings: asyncHandler(async (req, res) => {
    const bookings = await UserService.bookings(req.userId);

    res.status(200).json({
      success: true,
      bookings,
    });
  }),

  schedules: asyncHandler(async (req, res) => {
    const bookings = await UserService.schedules(req.userId);

    res.status(200).json({
      success: true,
      bookings,
    });
  }),

  logout: asyncHandler(async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  }),
};

export default UserController;
