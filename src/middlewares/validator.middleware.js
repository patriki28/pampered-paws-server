import { ZodError } from 'zod';
import logger from '../lib/winston/logger.js';

const validator = (schema) => (req, res, next) => {
  try {
    schema.parse({
      params: req.params,
      query: req.query,
      body: req.body,
    });

    next();
  } catch (err) {
    if (err instanceof ZodError) {
      logger.error({ errors: err.errors });
      res.status(400).json({
        errors: err.errors,
      });
      return;
    }
  }
};

export default validator;
