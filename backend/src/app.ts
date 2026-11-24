import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './config/auth.js';
import routes from './routes/index.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { globalErrorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { ENV } from './config/env.js';

export function createApp(): Express {
  const app = express();

  // Security Headers
  app.use(helmet());

  // CORS Configuration
  app.use(
    cors({
      origin: [ENV.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    })
  );

  // Request Logging
  if (ENV.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Mount Better Auth handler before express.json()
  const betterAuthHandler = toNodeHandler(auth);
  const customAuthEndpoints = [
    '/api/auth/register',
    '/api/auth/login',
    '/api/auth/me',
    '/api/auth/profile',
    '/api/auth/change-password',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/auth/verify-email'
  ];

  app.use('/api/auth', (req, res, next) => {
    const rawPath = req.originalUrl.split('?')[0];
    if (customAuthEndpoints.includes(rawPath)) {
      return next();
    }
    return betterAuthHandler(req, res);
  });

  // Body Parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // General Rate Limiting
  app.use('/api', apiLimiter);

  // Mount API Routes
  app.use('/api', routes);

  // 404 & Global Error Handling
  app.use(notFoundHandler);
  app.use(globalErrorHandler);

  return app;
}
