import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { seedInitialData } from './utils/seedData.js';
import { startCronJobs, stopCronJobs } from './jobs/cron.js';
import { ENV } from './config/env.js';
import { logger } from './utils/logger.js';

async function bootstrap() {
  const app = createApp();

  // Connect to Database
  const db = await connectDatabase();
  if (db) {
    // Seed default admin and 118th Draw
    await seedInitialData();
  }

  // Start Background Cron Jobs
  startCronJobs();

  const server = app.listen(ENV.PORT, () => {
    logger.info(`[Server] Bangladesh Prize Bond API running on port ${ENV.PORT} (${ENV.NODE_ENV})`);
    logger.info(`[Server] Health check available at: http://localhost:${ENV.PORT}/api/health`);
  });

  // Graceful Shutdown
  const shutdown = async (signal: string) => {
    logger.info(`[Server] Received ${signal}. Shutting down gracefully...`);
    stopCronJobs();
    server.close(async () => {
      await disconnectDatabase();
      logger.info('[Server] Process exited gracefully.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  logger.error(`[Server] Bootstrap error: ${err.message}`, err);
  process.exit(1);
});
