import 'dotenv/config';

const {
  PORT,
  BASE_URL,
  CLIENT_URL,
  NODE_ENV,
  MONGO_URI,
  JWT_SECRET,
  MAILTRAP_ENDPOINT,
  MAILTRAP_TOKEN,
} = process.env;

const APP_PORT = PORT || 3000;
const APP_BASE_URL = BASE_URL || 'http://localhost:';

export {
  APP_PORT,
  APP_BASE_URL,
  CLIENT_URL,
  NODE_ENV,
  MONGO_URI,
  JWT_SECRET,
  MAILTRAP_ENDPOINT,
  MAILTRAP_TOKEN,
};
