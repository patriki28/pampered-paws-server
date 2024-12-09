import { transporter } from '../../configs/nodemailer.config.js';
import { NODEMAILER_EMAIL } from '../../configs/env.config.js';
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from './email-templates.js';
import logger from '../winston/logger.js';

export async function sendEmail({ to, subject, html }) {
  if (!to || !subject) {
    throw new Error('Missing required fields: to, or subject');
  }

  try {
    const info = await transporter.sendMail({
      from: NODEMAILER_EMAIL,
      to,
      subject,
      html,
    });
    logger.info(`Email sent successfully: ${info.response}`);
  } catch (error) {
    logger.error(`Failed to send email: ${error.message}`);
    throw error;
  }
}

export async function sendVerificationEmail(email, verificationToken) {
  await sendEmail({
    from: NODEMAILER_EMAIL,
    to: email,
    subject: 'Verify your email',
    html: VERIFICATION_EMAIL_TEMPLATE.replace(
      '{verificationCode}',
      verificationToken,
    ),
  });
}

export async function sendPasswordResetEmail(email, resetURL) {
  await sendEmail({
    from: NODEMAILER_EMAIL,
    to: email,
    subject: 'Reset your password',
    html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetURL),
  });
}

export async function sendPasswordResetSuccessEmail(email) {
  await sendEmail({
    from: NODEMAILER_EMAIL,
    to: email,
    subject: 'Password Reset Successful',
    html: PASSWORD_RESET_SUCCESS_TEMPLATE,
  });
}
