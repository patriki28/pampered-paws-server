import jwt from 'jsonwebtoken';
import { JWT_SECRET, NODE_ENV } from '../configs/env.config.js';

export default function generateToken(res, userId) {
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
}
