import { mailtrapClient, sender } from '../../configs/mailtrap.config.js';
import logger from '../winston/logger.js';
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from './email-templates.js';

export async function sendVerificationEmail(email, verificationToken) {
  const recipient = [{ email }];

  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: 'Verify your email',
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        '{verificationCode}',
        verificationToken,
      ),
      category: 'Email Verification',
    });

    logger.info('Email Verification Sent.');
  } catch (error) {
    logger.error(`Error sending email verification`, error);
  }
}

export async function sendWelcomeEmail(email, name) {
  const recipient = [{ email }];

  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: '9111455e-5351-4f49-91eb-8bf87ce5db70',
      template_variables: {
        company_info_name: 'Pampered Paws',
        name: name,
      },
    });
    logger.info('Welcome Email Sent.');
  } catch (error) {
    logger.error(`Error sending welcome email`, error);
  }
}

export async function sendPasswordResetEmail(email, resetURL) {
  const recipient = [{ email }];

  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: 'Reset your password',
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetURL),
      category: 'Password Reset',
    });

    logger.info('Password Reset Email Sent.');
  } catch (error) {
    logger.error(`Error sending password reset email`, error);
  }
}

export async function sendPasswordResetSuccessEmail(email) {
  const recipient = [{ email }];

  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: 'Password Reset Successful',
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: 'Password Reset',
    });

    logger.info('Password Reset Success Email Sent.');
  } catch (error) {
    logger.error(`Error sending password reset success email`, error);
  }
}
