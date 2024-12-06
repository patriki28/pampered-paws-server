import asyncHandler from 'express-async-handler';
import AdminService from '../services/admin.service.js';
import generateToken from '../utils/generate-token.js';
import { CLIENT_URL } from '../configs/env.config.js';
import {
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from '../lib/mailtrap/email.js';

const AdminController = {
  register: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    const admin = await AdminService.register(username, email, password);

    await sendVerificationEmail(admin.email, admin.verificationToken);

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        _id: admin._id,
        email: admin.email,
        username: admin.username,
      },
    });
  }),

  verifyEmail: asyncHandler(async (req, res) => {
    const { code } = req.body;
    const admin = await AdminService.verifyEmail(code);

    await sendWelcomeEmail(admin.email, admin.username);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  }),

  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const admin = await AdminService.login(email, password);

    generateToken(res, admin._id);

    if (!admin.isVerified) {
      await sendVerificationEmail(admin.email, admin.verificationToken);

      throw new Error(
        `Admin is not verified. A verification email has been sent. Vefication token: ${admin.verificationToken}`,
      );
    }

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      admin: {
        _id: admin._id,
        email: admin.email,
        username: admin.username,
      },
    });
  }),

  forgotPassword: asyncHandler(async (req, res) => {
    const { email } = req.body;
    const admin = await AdminService.sendPasswordResetLink(email);

    await sendPasswordResetEmail(
      admin.email,
      `${CLIENT_URL}/reset-password/${admin.resetPasswordToken}`,
    );

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email',
    });
  }),

  resetPassword: asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const admin = await AdminService.resetPassword(token, password);
    await sendPasswordResetSuccessEmail(admin.email);

    res
      .status(200)
      .json({ success: true, message: 'Password reset successful' });
  }),

  profile: asyncHandler(async (req, res) => {
    const admin = await AdminService.findAdminById(req.userId);
    res.status(200).json({ success: true, admin });
  }),

  updateProfile: asyncHandler(async (req, res) => {
    const { username } = req.body;
    const admin = await AdminService.updateProfile(req.userId, username);

    res.status(200).json({
      success: true,
      message: 'Updated profile successfully',
      admin,
    });
  }),

  changePassword: asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await AdminService.changePassword(req.userId, currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: 'Changed password successfully',
    });
  }),

  logout: asyncHandler(async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  }),
};

export default AdminController;
