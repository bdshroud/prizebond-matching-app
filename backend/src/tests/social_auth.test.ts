import { describe, it, expect, vi } from 'vitest';
import { auth } from '../config/auth.js';
import { ENV } from '../config/env.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { signToken } from '../utils/jwt.js';
import { createApp } from '../app.js';
import request from 'supertest';

describe('5. Better Auth & Social Authentication Test Suite', () => {
  it('has Better Auth configured with correct baseURL and secrets', () => {
    expect(auth).toBeDefined();
    expect(auth.options).toBeDefined();
    expect(auth.options.baseURL).toBe(ENV.BETTER_AUTH_URL);
    expect(auth.options.secret).toBe(ENV.BETTER_AUTH_SECRET);
  });

  it('configures social providers with correct provider IDs: google, facebook, twitter', () => {
    const providers = auth.options.socialProviders;
    expect(providers).toBeDefined();
    expect(providers).toHaveProperty('google');
    expect(providers).toHaveProperty('facebook');
    expect(providers).toHaveProperty('twitter');
    // Ensure provider ID is 'twitter', not 'x' as required by Better Auth
    expect(providers).not.toHaveProperty('x');
  });

  it('enables account linking with trusted providers', () => {
    const accountConfig = auth.options.account;
    expect(accountConfig).toBeDefined();
    expect(accountConfig?.accountLinking).toBeDefined();
    expect(accountConfig?.accountLinking?.enabled).toBe(true);
    expect(accountConfig?.accountLinking?.trustedProviders).toEqual(
      expect.arrayContaining(['google', 'facebook', 'twitter'])
    );
  });

  it('configures trusted origins to prevent open redirect vulnerabilities', () => {
    const trustedOrigins = auth.options.trustedOrigins;
    expect(trustedOrigins).toBeDefined();
    expect(trustedOrigins).toEqual(
      expect.arrayContaining([
        ENV.CLIENT_URL,
        'http://localhost:3000',
        'http://127.0.0.1:3000'
      ])
    );
  });

  it('rejects unauthenticated requests with 401 when neither session nor JWT is provided', async () => {
    const req: any = {
      headers: {}
    };
    const res: any = {
      statusCode: 200,
      jsonData: null,
      status(code: number) {
        this.statusCode = code;
        return this;
      },
      json(data: any) {
        this.jsonData = data;
        return this;
      }
    };
    const next = vi.fn();

    await authenticate(req as AuthRequest, res as any, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(401);
    expect(res.jsonData.success).toBe(false);
  });

  it('authenticates valid traditional JWT bearer tokens', async () => {
    const validToken = signToken({
      userId: '6740a1234567890abcdef123',
      email: 'user@example.com',
      role: 'user'
    });

    const mockUser = {
      _id: '6740a1234567890abcdef123',
      email: 'user@example.com',
      role: 'user'
    };

    vi.spyOn(User, 'findById').mockResolvedValueOnce(mockUser as any);

    const req: any = {
      headers: {
        authorization: `Bearer ${validToken}`
      }
    };
    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    };
    const next = vi.fn();

    await authenticate(req as AuthRequest, res as any, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(mockUser);
    expect(req.tokenPayload.email).toBe('user@example.com');
  });

  it('routes custom authentication endpoints to Express handler', async () => {
    const app = createApp();
    // Test that custom endpoints bypass Better Auth 404 interceptor
    const res = await request(app).post('/api/auth/login').send({});
    // Should return 400 validation error from Express route validator, NOT Better Auth 404
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Validation failed');
  });
});
