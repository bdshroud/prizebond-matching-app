import cron from 'node-cron';
import { Draw } from '../models/Draw.js';
import { EmailLog } from '../models/EmailLog.js';
import { JobExecution } from '../models/JobExecution.js';
import { matchingService } from '../services/matching.service.js';
import { emailService } from '../services/email.service.js';
import { logger } from '../utils/logger.js';

let cronTasks: cron.ScheduledTask[] = [];

export function startCronJobs(): void {
  logger.info('[Cron Engine] Initializing automated background workers...');

  // 1. Worker: Check for un-matched verified draws and trigger matching
  // Runs every hour on the hour
  const drawMatcherTask = cron.schedule('0 * * * *', async () => {
    const jobName = 'cron_unmatched_draws_checker';
    const startTime = Date.now();
    logger.info('[Cron] Checking for verified draws requiring matching...');

    try {
      const pendingDraws = await Draw.find({
        isVerified: true,
        isPublished: true,
        processingStatus: { $in: ['pending', 'failed'] }
      });

      if (pendingDraws.length === 0) {
        logger.info('[Cron] No pending verified draws found.');
        return;
      }

      for (const draw of pendingDraws) {
        logger.info(`[Cron] Found pending draw ${draw.drawNumber}. Executing matching engine...`);
        await matchingService.runMatchingForDraw(draw._id);
      }
    } catch (err: any) {
      logger.error(`[Cron] Draw matcher worker error: ${err.message}`);
      await JobExecution.create({
        jobName,
        status: 'failed',
        startedAt: new Date(startTime),
        finishedAt: new Date(),
        durationMs: Date.now() - startTime,
        error: err.message
      });
    }
  });

  // 2. Worker: Retry failed notification emails
  // Runs every 30 minutes
  const emailRetryTask = cron.schedule('*/30 * * * *', async () => {
    try {
      const failedEmails = await EmailLog.find({
        status: 'failed',
        attempts: { $lt: 3 }
      }).limit(20);

      if (failedEmails.length > 0) {
        logger.info(`[Cron] Retrying ${failedEmails.length} failed notification emails...`);
        for (const log of failedEmails) {
          log.attempts += 1;
          log.status = 'retrying';
          await log.save();

          const sent = await emailService.sendMail({
            to: log.recipientEmail,
            userId: log.user || undefined,
            subject: log.subject,
            html: `<p>Retried notification for: ${log.subject}</p>`,
            template: log.template
          });

          log.status = sent ? 'sent' : 'failed';
          log.sentAt = sent ? new Date() : null;
          await log.save();
        }
      }
    } catch (err: any) {
      logger.error(`[Cron] Email retry worker error: ${err.message}`);
    }
  });

  cronTasks = [drawMatcherTask, emailRetryTask];
  logger.info('[Cron Engine] Background workers started successfully.');
}

export function stopCronJobs(): void {
  for (const task of cronTasks) {
    task.stop();
  }
  cronTasks = [];
  logger.info('[Cron Engine] All background workers stopped.');
}
