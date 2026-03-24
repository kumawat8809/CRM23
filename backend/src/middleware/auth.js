import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function auth(requiredRoles = []) {
  return (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const payload = jwt.verify(token, env.jwtSecret);
      req.user = payload;

      if (requiredRoles.length > 0 && !requiredRoles.includes(payload.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      return next();
    } catch {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}
