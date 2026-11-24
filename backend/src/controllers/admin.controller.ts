import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { PrizeBond } from '../models/PrizeBond.js';
import { Draw } from '../models/Draw.js';
import { Match } from '../models/Match.js';
import { JobExecution } from '../models/JobExecution.js';
import { EmailLog } from '../models/EmailLog.js';
import { AuditLog } from '../models/AuditLog.js';
import { matchingService } from '../services/matching.service.js';
import { emailService } from '../services/email.service.js';

export const adminController = {
  getSystemStats: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const [
        totalUsers,
        totalBonds,
        totalDraws,
        totalMatches,
        failedEmails,
        recentJobs,
        prizeWonAgg
      ] = await Promise.all([
        User.countDocuments(),
        PrizeBond.countDocuments(),
        Draw.countDocuments(),
        Match.countDocuments(),
        EmailLog.countDocuments({ status: 'failed' }),
        JobExecution.find().sort({ startedAt: -1 }).limit(5),
        Match.aggregate([
          { $group: { _id: null, totalGross: { $sum: '$grossAmount' }, totalNet: { $sum: '$netAmount' } } }
        ])
      ]);

      res.status(200).json({
        success: true,
        data: {
          totalUsers,
          totalBonds,
          totalDraws,
          totalMatches,
          failedEmails,
          totalPrizeDisbursed: prizeWonAgg[0]?.totalGross || 0,
          totalTaxWithheld: (prizeWonAgg[0]?.totalGross || 0) - (prizeWonAgg[0]?.totalNet || 0),
          recentJobs
        }
      });
    } catch (err) {
      next(err);
    }
  },

  getUsers: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
      const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || '20'), 10)));
      const skip = (page - 1) * limit;

      const filter: Record<string, any> = {};
      if (req.query.search) {
        const s = new RegExp(String(req.query.search).trim(), 'i');
        filter.$or = [{ name: s }, { email: s }];
      }
      if (req.query.role) {
        filter.role = req.query.role;
      }

      const [users, total] = await Promise.all([
        User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        User.countDocuments(filter)
      ]);

      res.status(200).json({
        success: true,
        data: {
          users,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (err) {
      next(err);
    }
  },

  updateUserRole: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { role } = req.body;
      const id = String(req.params.id);
      const user = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true }
      );

      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      await AuditLog.create({
        user: req.user!._id,
        action: 'UPDATE_USER_ROLE',
        entityType: 'User',
        entityId: user._id.toString(),
        details: { targetEmail: user.email, newRole: role }
      });

      res.status(200).json({
        success: true,
        message: 'User role updated',
        data: user
      });
    } catch (err) {
      next(err);
    }
  },

  getJobs: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
      const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || '20'), 10)));
      const skip = (page - 1) * limit;

      const [jobs, total] = await Promise.all([
        JobExecution.find().sort({ startedAt: -1 }).skip(skip).limit(limit),
        JobExecution.countDocuments()
      ]);

      res.status(200).json({
        success: true,
        data: {
          jobs,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (err) {
      next(err);
    }
  },

  runMatchingJob: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { drawId } = req.body;
      const result = await matchingService.runMatchingForDraw(drawId);

      await AuditLog.create({
        user: req.user!._id,
        action: 'TRIGGER_MANUAL_MATCHING_JOB',
        entityType: 'Draw',
        entityId: drawId,
        details: { matchedCount: result.matchedCount, totalPrizeWon: result.totalPrizeWon }
      });

      res.status(200).json({
        success: true,
        message: 'Matching job finished successfully',
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  getEmailLogs: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
      const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || '20'), 10)));
      const skip = (page - 1) * limit;

      const filter: Record<string, any> = {};
      if (req.query.status) {
        filter.status = req.query.status;
      }
      if (req.query.recipient) {
        filter.recipientEmail = new RegExp(String(req.query.recipient).trim(), 'i');
      }

      const [logs, total] = await Promise.all([
        EmailLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        EmailLog.countDocuments(filter)
      ]);

      res.status(200).json({
        success: true,
        data: {
          logs,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (err) {
      next(err);
    }
  },

  retryFailedEmail: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const log = await EmailLog.findById(id);
      if (!log) {
        res.status(404).json({ success: false, message: 'Email log not found' });
        return;
      }

      log.attempts += 1;
      log.status = 'retrying';
      await log.save();

      // Retry sending
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

      res.status(200).json({
        success: true,
        message: sent ? 'Email delivered successfully' : 'Email retry failed',
        data: log
      });
    } catch (err) {
      next(err);
    }
  },

  getAuditLogs: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
      const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || '20'), 10)));
      const skip = (page - 1) * limit;

      const [logs, total] = await Promise.all([
        AuditLog.find().populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
        AuditLog.countDocuments()
      ]);

      res.status(200).json({
        success: true,
        data: {
          logs,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (err) {
      next(err);
    }
  }
};
