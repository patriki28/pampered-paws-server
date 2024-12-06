import { Router } from 'express';
import userController from '../controllers/user.controller.js';

import verifyToken from '../middlewares/verify-token.middleware.js';
import validator from '../middlewares/validator.middleware.js';

import {
  RegisterUserSchema,
  UpdateUserSchema,
} from '../schemas/user.schema.js';
import {
  ChangePasswordSchema,
  ForgotPasswordSchema,
  LoginSchema,
  ResetPasswordSchema,
} from '../schemas/auth.schema.js';

const userRouter = Router();

/**
 * User
 * @typedef {object} User
 * @property {string} _id
 * @property {string} firstName
 * @property {string} middleName
 * @property {string} lastName
 * @property {string} phoneNumber
 * @property {string} email
 * @property {boolean} isVerified
 */

/**
 * JWT Cookie Token
 * @typedef {object} JWTCookieToken
 * @property {string} token.required
 */

/**
 * Register User
 * @typedef {object} RegisterUser
 * @property {string} firstName.required
 * @property {string} middleName
 * @property {string} lastName.required
 * @property {string} phoneNumber.required
 * @property {string} email.required
 * @property {string} password.required
 */

/**
 * POST /api/users/register
 * @summary Register a new user
 * @tags User
 * @param {RegisterUser} request.body.required - User registration details
 * @return {User} 201 - Successfully registered user
 */
userRouter.post(
  '/register',
  validator(RegisterUserSchema),
  userController.register,
);

/**
 * Login User
 * @typedef {object} LoginUser
 * @property {string} email.required
 * @property {string} password.required
 */

/**
 * POST /api/users/login
 * @summary Authenticate a user
 * @tags User
 * @param {LoginUser} request.body.required - User login credentials
 * @return {JWTCookieToken} 200 - Authentication token
 */
userRouter.post('/login', validator(LoginSchema), userController.login);

/**
 * Verify Email
 * @typedef {object} VerifyEmail
 * @property {number} code.required
 */

/**
 * POST /api/users/verify-email
 * @summary Verify user's email
 * @tags User
 * @param {VerifyEmail} request.body.required - Verification code
 * @return {string} 200 - Email verified message
 */
userRouter.post('/verify-email', userController.verifyEmail);

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
 * POST /api/users/forgot-password
 * @summary Request a password reset
 * @tags User
 * @param {ForgotPassword} request.body.required - User email for password reset
 * @return {ResetPasswordToken} 200 - Reset token
 */
userRouter.post(
  '/forgot-password',
  validator(ForgotPasswordSchema),
  userController.forgotPassword,
);

/**
 * Reset Password
 * @typedef {object} ResetPassword
 * @property {string} password.required
 */

/**
 * POST /api/users/reset-password/{token}
 * @summary Reset user's password
 * @tags User
 * @param {string} token.path.required - Reset token
 * @param {ResetPassword} request.body.required - New password
 * @return {string} 200 - Password reset successful message
 */
userRouter.post(
  '/reset-password/:token',
  validator(ResetPasswordSchema),
  userController.resetPassword,
);

/**
 * POST /api/users/logout
 * @summary Log out user
 * @tags User
 * @return {string} 200 - Logout successful message
 */
userRouter.post('/logout', userController.logout);

/**
 * GET /api/users/profile
 * @summary Get user's profile
 * @tags User
 * @security JWT
 * @return {User} 200 - User profile details
 */
userRouter.get('/profile', verifyToken, userController.profile);

/**
 * Bookings
 * @typedef {object} Bookings
 * @property {string} _id
 * @property {string} dogCategory
 * @property {string} service
 * @property {number} price
 * @property {string} schedule
 * @property {string} status
 * @property {string} user
 */

/**
 * GET /api/users/bookings
 * @summary Get user's bookings
 * @tags User
 * @security JWT
 * @return {array<Bookings>} 200 - List of bookings
 */
userRouter.get('/bookings', verifyToken, userController.bookings);

/**
 * Schedules
 * @typedef {object} Schedules
 * @property {string} event_id
 * @property {string} title
 * @property {string} start
 * @property {string} end
 */

/**
 * GET /api/users/schedules
 * @summary Get user's schedules
 * @tags User
 * @security JWT
 * @return {array<Schedules>} 200 - List of schedules
 */
userRouter.get('/schedules', verifyToken, userController.schedules);

/**
 * Update User
 * @typedef {object} UpdateUser
 * @property {string} firstName.required
 * @property {string} middleName
 * @property {string} lastName.required
 */

/**
 * PUT /api/users/update-profile
 * @summary Update user's profile
 * @tags User
 * @security JWT
 * @param {UpdateUser} request.body.required - Updated user details
 * @return {User} 200 - Updated user details
 */
userRouter.put(
  '/update-profile',
  validator(UpdateUserSchema),
  verifyToken,
  userController.updateProfile,
);

/**
 * Change Password
 * @typedef {object} ChangePassword
 * @property {string} currentPassword.required
 * @property {string} newPassword.required
 */

/**
 * PUT /api/users/change-password
 * @summary Change user's password
 * @tags User
 * @security JWT
 * @param {ChangePassword} request.body.required - Password change details
 * @return {string} 200 - Password change successful message
 */
userRouter.put(
  '/change-password',
  validator(ChangePasswordSchema),
  verifyToken,
  userController.changePassword,
);

export default userRouter;
