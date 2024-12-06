import { Router } from 'express';
import adminController from '../controllers/admin.controller.js';

import verifyToken from '../middlewares/verify-token.middleware.js';
import validator from '../middlewares/validator.middleware.js';

import {
  RegisterAdminSchema,
  UpdateAdminSchema,
} from '../schemas/admin.schema.js';
import {
  ChangePasswordSchema,
  ForgotPasswordSchema,
  LoginSchema,
  ResetPasswordSchema,
} from '../schemas/auth.schema.js';

const adminRouter = Router();

/**
 * Admin
 * @typedef {object} Admin
 * @property {string} _id
 * @property {string} username
 * @property {string} email
 * @property {boolean} isVerified
 */

/**
 * JWT Cookie Token
 * @typedef {object} JWTCookieToken
 * @property {string} token.required
 */

/**
 * Register Admin
 * @typedef {object} RegisterAdmin
 * @property {string} username.required
 * @property {string} email.required
 * @property {string} password.required
 */

/**
 * POST /api/admins/register
 * @summary Register a new admin
 * @tags Admin
 * @param {RegisterAdmin} request.body.required - Admin registration details
 * @return {Admin} 201 - Successfully registered admin
 */
adminRouter.post(
  '/register',
  validator(RegisterAdminSchema),
  adminController.register,
);

/**
 * Login Admin
 * @typedef {object} LoginAdmin
 * @property {string} email.required
 * @property {string} password.required
 */

/**
 * POST /api/admins/login
 * @summary Authenticate a admin
 * @tags Admin
 * @param {LoginAdmin} request.body.required - Admin login credentials
 * @return {JWTCookieToken} 200 - Authentication token
 */
adminRouter.post('/login', validator(LoginSchema), adminController.login);

/**
 * Verify Email
 * @typedef {object} VerifyEmail
 * @property {number} code.required
 */

/**
 * POST /api/admins/verify-email
 * @summary Verify admin's email
 * @tags Admin
 * @param {VerifyEmail} request.body.required - Verification code
 * @return {string} 200 - Email verified message
 */
adminRouter.post('/verify-email', adminController.verifyEmail);

/**
 * Forgot Password
 * @typedef {object} ForgotPassword
 * @property {string} email.required
 */

/**
 * Reset Password Token
 * @typedef {object} ResetPasswordToken
 * @property {string} resetPasswordToken
 */

/**
 * POST /api/admins/forgot-password
 * @summary Request a password reset
 * @tags Admin
 * @param {ForgotPassword} request.body.required - Admin email for password reset
 * @return {ResetPasswordToken} 200 - Reset token
 */
adminRouter.post(
  '/forgot-password',
  validator(ForgotPasswordSchema),
  adminController.forgotPassword,
);

/**
 * POST /api/admins/reset-password/{token}
 * @summary Reset admin's password
 * @tags Admin
 * @param {string} token.path.required - Reset token
 * @param {ResetPassword} request.body.required - New password
 * @return {string} 200 - Password reset successful message
 */
adminRouter.post(
  '/reset-password/:token',
  validator(ResetPasswordSchema),
  adminController.resetPassword,
);

/**
 * POST /api/admins/logout
 * @summary Log out admin
 * @tags Admin
 * @return {string} 200 - Logout successful message
 */
adminRouter.post('/logout', adminController.logout);

/**
 * GET /api/admins/profile
 * @summary Get admin's profile
 * @tags Admin
 * @security JWT
 * @return {Admin} 200 - Admin profile details
 */
adminRouter.get('/profile', verifyToken, adminController.profile);

/**
 * Update Admin
 * @typedef {object} UpdateAdmin
 * @property {string} username.required
 */

/**
 * PUT /api/admins/update-profile
 * @summary Update admin's profile
 * @tags Admin
 * @security JWT
 * @param {UpdateAdmin} request.body.required - Updated admin details
 * @return {Admin} 200 - Updated admin details
 */
adminRouter.put(
  '/update-profile',
  validator(UpdateAdminSchema),
  verifyToken,
  adminController.updateProfile,
);

/**
 * Change Password
 * @typedef {object} ChangePassword
 * @property {string} currentPassword.required
 * @property {string} newPassword.required
 */

/**
 * PUT /api/admins/change-password
 * @summary Change admin's password
 * @tags Admin
 * @security JWT
 * @param {ChangePassword} request.body.required - Password change details
 * @return {string} 200 - Password change successful message
 */
adminRouter.put(
  '/change-password',
  validator(ChangePasswordSchema),
  verifyToken,
  adminController.changePassword,
);

export default adminRouter;
