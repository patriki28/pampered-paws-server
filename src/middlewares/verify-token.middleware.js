import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/env.config.js';
import logger from '../lib/winston/logger.js';

export default function verifyToken(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    logger.error('Unauthorized - no token provided');
    return res.status(401).json({ error: 'Unauthorized - no token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    logger.error(error);
    return res
      .status(401)
      .json({ error: 'Unauthorized - invalid or expired token' });
  }
}
