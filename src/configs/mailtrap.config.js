import { MailtrapClient } from 'mailtrap';
import { MAILTRAP_ENDPOINT, MAILTRAP_TOKEN } from './env.config.js';

export const mailtrapClient = new MailtrapClient({
  endpoint: MAILTRAP_ENDPOINT,
  token: MAILTRAP_TOKEN,
});

export const sender = {
  email: 'mailtrap@demomailtrap.com',
  name: 'Pampered Paws',
};
