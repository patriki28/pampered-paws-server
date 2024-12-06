import { NODE_ENV } from '../configs/env.config.js';
import logger from '../lib/winston/logger.js';

// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  logger.error(err.message);

  const statusCode = err.statusCode || 500;

  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
  };

  if (NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}
