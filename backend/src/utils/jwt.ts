import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

export interface ITokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function signToken(payload: ITokenPayload): string {
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN as any
  });
}

export function verifyToken(token: string): ITokenPayload | null {
  try {
    return jwt.verify(token, ENV.JWT_SECRET) as ITokenPayload;
  } catch (err) {
    return null;
  }
}
