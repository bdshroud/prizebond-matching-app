import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/prizebond_platform',
  JWT_SECRET: process.env.JWT_SECRET || 'prizebond_default_development_secret_key_2025_secure',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'PrizeBond Bangladesh <notifications@prizebond.gov.bd>',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  ADMIN_NAME: process.env.ADMIN_NAME || 'Platform Administrator',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@prizebond.gov.bd',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'AdminSecurePass2025!',
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET || 'prizebond_better_auth_dev_secret_at_least_32_chars_long',
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || 'http://localhost:5000',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID || '',
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET || '',
  TWITTER_CLIENT_ID: process.env.TWITTER_CLIENT_ID || '',
  TWITTER_CLIENT_SECRET: process.env.TWITTER_CLIENT_SECRET || ''
};
