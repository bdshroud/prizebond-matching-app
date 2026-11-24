import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { bearer } from 'better-auth/plugins';
import { MongoClient } from 'mongodb';
import { ENV } from './env.js';
import { logger } from '../utils/logger.js';

let mongoClient: MongoClient;
try {
  mongoClient = new MongoClient(ENV.MONGODB_URI);
} catch (err) {
  logger.warn('Better Auth: MongoClient fallback for local environment');
  mongoClient = new MongoClient('mongodb://localhost:27017/prizebond_platform');
}

const db = mongoClient.db();

export const auth = betterAuth({
  secret: ENV.BETTER_AUTH_SECRET,
  baseURL: ENV.BETTER_AUTH_URL,
  database: mongodbAdapter(db, {
    client: mongoClient,
    transaction: false
  }),
  plugins: [bearer()],
  socialProviders: {
    google: {
      clientId: ENV.GOOGLE_CLIENT_ID || 'mock_google_client_id',
      clientSecret: ENV.GOOGLE_CLIENT_SECRET || 'mock_google_client_secret',
      enabled: !!(ENV.GOOGLE_CLIENT_ID && ENV.GOOGLE_CLIENT_SECRET)
    },
    facebook: {
      clientId: ENV.FACEBOOK_CLIENT_ID || 'mock_facebook_client_id',
      clientSecret: ENV.FACEBOOK_CLIENT_SECRET || 'mock_facebook_client_secret',
      enabled: !!(ENV.FACEBOOK_CLIENT_ID && ENV.FACEBOOK_CLIENT_SECRET)
    },
    twitter: {
      clientId: ENV.TWITTER_CLIENT_ID || 'mock_twitter_client_id',
      clientSecret: ENV.TWITTER_CLIENT_SECRET || 'mock_twitter_client_secret',
      enabled: !!(ENV.TWITTER_CLIENT_ID && ENV.TWITTER_CLIENT_SECRET)
    }
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google', 'facebook', 'twitter'],
      disableImplicitLinking: false
    }
  },
  trustedOrigins: [
    ENV.CLIENT_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  advanced: {
    defaultCookieAttributes: {
      sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: ENV.NODE_ENV === 'production'
    }
  }
});
