import { Request, Response, NextFunction } from 'express';
import { verifyToken, ITokenPayload } from '../utils/jwt.js';
import { User, IUser } from '../models/User.js';
import { ROLES } from '../config/constants.js';

export interface AuthRequest extends Request {
  user?: IUser;
  tokenPayload?: ITokenPayload;
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. Please provide a valid Bearer token.'
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    if (!payload) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired session token. Please log in again.'
      });
      return;
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User account not found.'
      });
      return;
    }

    req.user = user;
    req.tokenPayload = payload;
    next();
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Authentication failed due to internal error',
      error: error.message
    });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== ROLES.ADMIN) {
    res.status(403).json({
      success: false,
      message: 'Forbidden. Administrative privileges are required for this action.'
    });
    return;
  }
  next();
}
