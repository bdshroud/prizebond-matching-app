import mongoose from 'mongoose';
import { ENV } from './env.js';

let isConnected = false;

export async function connectDatabase(): Promise<typeof mongoose | null> {
  if (isConnected) {
    return mongoose;
  }

  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error: any) {
    console.warn(`[MongoDB] Warning: Could not connect to MongoDB at ${ENV.MONGODB_URI}: ${error.message}`);
    console.warn('[MongoDB] Running in fallback mode. Connect a live MongoDB or set MONGODB_URI to persist to MongoDB Atlas.');
    return null;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('[MongoDB] Disconnected successfully');
  }
}
