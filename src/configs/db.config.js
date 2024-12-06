import mongoose from 'mongoose';
import { MONGO_URI } from './env.config.js';
import logger from '../lib/winston/logger.js';

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info(`MongoDB Connected`);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

export default connectDB;
