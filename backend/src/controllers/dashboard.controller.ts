import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { PrizeBond } from '../models/PrizeBond.js';
import { Draw } from '../models/Draw.js';
import { Match } from '../models/Match.js';
import { Notification } from '../models/Notification.js';

export const dashboardController = {
  getUserDashboard: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id;

      // Aggregations in parallel
      const [
        totalBonds,
        activeBonds,
        totalCheckedDraws,
        winningMatches,
        recentNotifications,
        recentDraws,
        recentWins,
        latestPublishedDraw
      ] = await Promise.all([
        PrizeBond.countDocuments({ user: userId }),
        PrizeBond.countDocuments({ user: userId, isEnabled: true }),
        Draw.countDocuments({ isVerified: true, isPublished: true }),
        Match.find({ user: userId }),
        Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
        Draw.find({ isVerified: true, isPublished: true }).sort({ drawDate: -1 }).limit(4),
        Match.find({ user: userId }).sort({ drawDate: -1 }).limit(5),
        Draw.findOne({ isVerified: true, isPublished: true }).sort({ drawDate: -1 })
      ]);

      const totalWinningBonds = winningMatches.length;
      const totalEstimatedPrizeMoney = winningMatches.reduce((sum, m) => sum + m.grossAmount, 0);
      const totalEstimatedNetMoney = winningMatches.reduce((sum, m) => sum + m.netAmount, 0);

      // Bangladesh Bank Quarterly Draws occur regularly on: Jan 31, Apr 30, Jul 31, Oct 31
      // Calculate next scheduled draw date
      const now = new Date();
      const currentYear = now.getFullYear();
      const scheduleDates = [
        new Date(currentYear, 0, 31),  // 31 Jan
        new Date(currentYear, 3, 30),  // 30 Apr
        new Date(currentYear, 6, 31),  // 31 Jul
        new Date(currentYear, 9, 31),  // 31 Oct
        new Date(currentYear + 1, 0, 31) // Next year 31 Jan
      ];

      const nextDrawDate = scheduleDates.find((d) => d > now) || scheduleDates[scheduleDates.length - 1];

      res.status(200).json({
        success: true,
        data: {
          statistics: {
            totalBonds,
            activeBonds,
            totalCheckedDraws,
            totalWinningBonds,
            totalEstimatedPrizeMoney,
            totalEstimatedNetMoney
          },
          nextScheduledDrawDate: nextDrawDate.toISOString(),
          latestPublishedDraw,
          recentNotifications,
          recentDraws,
          recentWins
        }
      });
    } catch (err) {
      next(err);
    }
  }
};
