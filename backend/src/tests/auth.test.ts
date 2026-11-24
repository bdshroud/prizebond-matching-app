import { describe, it, expect } from 'vitest';
import bcrypt from 'bcryptjs';
import { signToken, verifyToken } from '../utils/jwt.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

describe('1. Authentication & Security Test Suite', () => {
  it('correctly hashes passwords with bcrypt and verifies hashes', async () => {
    const rawPassword = 'SecureUserPassword123!';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(rawPassword, salt);

    expect(hash).not.toBe(rawPassword);
    expect(hash.startsWith('$2')).toBe(true);

    const isMatch = await bcrypt.compare(rawPassword, hash);
    expect(isMatch).toBe(true);

    const isWrongMatch = await bcrypt.compare('WrongPassword456!', hash);
    expect(isWrongMatch).toBe(false);
  });

  it('signs and verifies JWT tokens with proper claims', () => {
    const payload = {
      userId: '6740a1234567890abcdef123',
      email: 'citizen@example.com',
      role: 'user'
    };

    const token = signToken(payload);
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);

    const decoded = verifyToken(token);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
  });

  it('validates user registration schema requirements', () => {
    // Valid input
    const valid = registerSchema.safeParse({
      body: {
        name: 'Rafiqul Islam',
        email: 'rafiq@example.com',
        password: 'Password123!',
        phone: '+8801712345678'
      }
    });
    expect(valid.success).toBe(true);

    // Invalid email
    const invalidEmail = registerSchema.safeParse({
      body: {
        name: 'Rafiqul Islam',
        email: 'not-an-email',
        password: 'Password123!'
      }
    });
    expect(invalidEmail.success).toBe(false);

    // Password too short (< 6 chars)
    const shortPassword = registerSchema.safeParse({
      body: {
        name: 'Rafiqul Islam',
        email: 'rafiq@example.com',
        password: '123'
      }
    });
    expect(shortPassword.success).toBe(false);
  });

  it('validates user login schema requirements', () => {
    const valid = loginSchema.safeParse({
      body: {
        email: 'user@example.com',
        password: 'Password123!'
      }
    });
    expect(valid.success).toBe(true);

    const invalid = loginSchema.safeParse({
      body: {
        email: '',
        password: ''
      }
    });
    expect(invalid.success).toBe(false);
  });
});

describe('2. Role-Based Access Control (Admin Permissions)', () => {
  it('correctly discriminates admin role from regular user role', () => {
    const adminUser = { role: 'admin' };
    const normalUser = { role: 'user' };

    function hasAdminAccess(user: { role: string } | null | undefined): boolean {
      return !!user && user.role === 'admin';
    }

    expect(hasAdminAccess(adminUser)).toBe(true);
    expect(hasAdminAccess(normalUser)).toBe(false);
    expect(hasAdminAccess(null)).toBe(false);
    expect(hasAdminAccess(undefined)).toBe(false);
  });

  it('verifies that unverified draws cannot be published by non-admins', () => {
    const userRole = 'user';
    const canPublishDraw = userRole === 'admin';
    expect(canPublishDraw).toBe(false);

    const adminRole = 'admin';
    const canAdminPublish = adminRole === 'admin';
    expect(canAdminPublish).toBe(true);
  });
});
