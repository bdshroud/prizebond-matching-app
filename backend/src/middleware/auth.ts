import { Request, Response, NextFunction } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { verifyToken, ITokenPayload } from '../utils/jwt.js';
import { User, IUser } from '../models/User.js';
import { ROLES } from '../config/constants.js';
import { auth } from '../config/auth.js';

export interface AuthRequest extends Request {
  user?: IUser;
  tokenPayload?: ITokenPayload;
  session?: any;
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    // 1. Check for Better Auth session (via cookies or Better Auth bearer plugin)
    try {
      const betterSession = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
      });

      if (betterSession && betterSession.user) {
        let user = await User.findOne({ email: betterSession.user.email });
        if (!user) {
          user = await User.create({
            name: betterSession.user.name || 'User',
            email: betterSession.user.email,
            image: betterSession.user.image,
            isEmailVerified: betterSession.user.emailVerified ?? true,
            role: ROLES.USER
          });
        }
        req.user = user;
        req.session = betterSession;
        return next();
      }
    } catch (sessionErr) {
      // Better Auth session lookup skipped if not present or DB pending
    }

    // 2. Check for traditional JWT Bearer token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const payload = verifyToken(token);

      if (payload) {
        const user = await User.findById(payload.userId);
        if (user) {
          req.user = user;
          req.tokenPayload = payload;
          return next();
        }
      }
    }

    res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in or provide a valid session token.'
    });
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
