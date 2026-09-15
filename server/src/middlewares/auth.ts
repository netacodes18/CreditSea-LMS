import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { Role } from '../models/User';

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    let token;
    
    // Check cookies for HTTP-only token
    if (req.headers.cookie) {
      const cookies = req.headers.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'token') {
          token = value;
          break;
        }
      }
    }

    if (!token) {
      res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
      return;
    }

    const decoded = verifyToken(token);
    req.user = {
      id: decoded.id,
      role: decoded.role as Role,
    };
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    return;
  }
};

export const requireRole = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    // Admin can access everything in this system for ease of management
    if (req.user.role === Role.ADMIN || roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
      return;
    }
  };
};
