import { Types } from 'mongoose';
import { Draw, IDraw } from '../models/Draw.js';
import { WinningNumber, IWinningNumber } from '../models/WinningNumber.js';
import { PrizeBond, IPrizeBond } from '../models/PrizeBond.js';
import { Match, IMatch } from '../models/Match.js';
import { JobExecution } from '../models/JobExecution.js';
import { User, IUser } from '../models/User.js';
import { calculatePrizeTax } from '../utils/taxCalculator.js';
import { notificationService } from './notification.service.js';
import { emailService } from './email.service.js';
import {
  MIN_PURCHASE_DAYS_BEFORE_DRAW,
  CLAIM_VALIDITY_DAYS,
  NOTIFICATION_TYPES
} from '../config/constants.js';
import { logger } from '../utils/logger.js';

export interface IMatchingResult {
  drawId: string;
  drawNumber: string;
  totalBondsChecked: number;
  matchedCount: number;
  totalPrizeWon: number;
  durationMs: number;
  matches: Array<{
    userId: string;
    bondNumber: string;
    series: string;
    prizeTitleBn: string;
    prizeAmount: number;
  }>;
}

export const matchingService = {
  /**
   * Run the matching engine for a specific verified draw
   */
  runMatchingForDraw: async (drawId: string | Types.ObjectId): Promise<IMatchingResult> => {
    const startTime = Date.now();
    const jobExecution = await JobExecution.create({
      jobName: `draw_matching_${drawId}`,
      status: 'running',
      startedAt: new Date(),
      details: { drawId }
    });

    try {
      const draw = await Draw.findById(drawId);
      if (!draw) {
        throw new Error(`Draw with ID ${drawId} not found`);
      }

      if (!draw.isVerified) {
        throw new Error(`Cannot run matching on unverified draw ${draw.drawNumber}`);
      }

      // Mark draw as processing
      draw.processingStatus = 'processing';
      await draw.save();

      // 1. Fetch all official winning numbers for this draw
      const winningNumbers = await WinningNumber.find({ draw: draw._id });
      if (winningNumbers.length === 0) {
        logger.warn(`[Matching Engine] Draw ${draw.drawNumber} has no winning numbers recorded.`);
        draw.processingStatus = 'completed';
        await draw.save();
        await jobExecution.updateOne({
          status: 'completed',
          finishedAt: new Date(),
          durationMs: Date.now() - startTime,
          details: { message: 'Draw has no winning numbers' }
        });
        return {
          drawId: draw._id.toString(),
          drawNumber: draw.drawNumber,
          totalBondsChecked: 0,
          matchedCount: 0,
          totalPrizeWon: 0,
          durationMs: Date.now() - startTime,
          matches: []
        };
      }

      // Map winning numbers by bondNumber for instant O(1) lookups
      const winningMap = new Map<string, IWinningNumber[]>();
      for (const win of winningNumbers) {
        const existing = winningMap.get(win.bondNumber) || [];
        existing.push(win);
        winningMap.set(win.bondNumber, existing);
      }

      const candidateNumbers = Array.from(winningMap.keys());
      const totalSystemBonds = await PrizeBond.countDocuments({ isEnabled: true });

      // 2. High-performance indexed lookup: find all enabled user bonds that match any winning number
      const candidateBonds = await PrizeBond.find({
        isEnabled: true,
        bondNumber: { $in: candidateNumbers }
      }).populate<{ user: IUser }>('user');

      logger.info(
        `[Matching Engine] Draw ${draw.drawNumber}: Checking ${candidateBonds.length} candidate hits across ${totalSystemBonds} total bonds.`
      );

      let matchedCount = 0;
      let totalPrizeWon = 0;
      const recordedMatches: IMatchingResult['matches'] = [];

      const claimDeadline = new Date(draw.drawDate.getTime() + CLAIM_VALIDITY_DAYS * 24 * 60 * 60 * 1000);

      // 3. Process candidate matches
      for (const bond of candidateBonds) {
        if (!bond.user) continue;

        // Check 60-day purchase eligibility rule
        if (bond.purchaseDate) {
          const diffTime = draw.drawDate.getTime() - bond.purchaseDate.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays < MIN_PURCHASE_DAYS_BEFORE_DRAW) {
            logger.info(
              `[Matching Engine] Bond ${bond.bondNumber} skipped: purchased ${diffDays} days before draw (min ${MIN_PURCHASE_DAYS_BEFORE_DRAW} days required).`
            );
            continue;
          }
        }

        const potentialWins = winningMap.get(bond.bondNumber) || [];

        for (const win of potentialWins) {
          // Check series eligibility
          const applicableSeries = (win.applicableSeries || 'all').toLowerCase();
          const bondSeries = (bond.series || '').toLowerCase();

          const isSeriesMatch =
            applicableSeries === 'all' ||
            !bondSeries ||
            applicableSeries === bondSeries;

          if (!isSeriesMatch) {
            continue;
          }

          // Check idempotency: avoid duplicate match records
          const existingMatch = await Match.findOne({
            draw: draw._id,
            user: bond.user._id,
            bond: bond._id,
            prizeCategory: win.prizeCategory
          });

          if (existingMatch) {
            logger.info(`[Matching Engine] Match already exists for bond ${bond.bondNumber} in draw ${draw.drawNumber}`);
            continue;
          }

          // Compute official withholding tax (20%)
          const taxInfo = calculatePrizeTax(win.prizeAmount);

          // Save Match record
          const matchRecord = await Match.create({
            user: bond.user._id,
            bond: bond._id,
            draw: draw._id,
            winningNumber: win._id,
            bondNumber: bond.bondNumber,
            series: bond.series || '',
            drawNumber: draw.drawNumber,
            drawDate: draw.drawDate,
            prizeCategory: win.prizeCategory,
            prizeTitleBn: win.prizeTitleBn,
            prizeTitleEn: win.prizeTitleEn,
            grossAmount: taxInfo.grossAmount,
            estimatedTax: taxInfo.estimatedTax,
            netAmount: taxInfo.netAmount,
            claimDeadline,
            emailSent: false,
            emailDeliveryStatus: 'pending'
          });

          matchedCount++;
          totalPrizeWon += taxInfo.grossAmount;
          recordedMatches.push({
            userId: bond.user._id.toString(),
            bondNumber: bond.bondNumber,
            series: bond.series || '',
            prizeTitleBn: win.prizeTitleBn,
            prizeAmount: taxInfo.grossAmount
          });

          // 4. Create in-app notification
          if (bond.user.notificationPreferences?.inAppNotifications !== false) {
            await notificationService.createNotification({
              userId: bond.user._id,
              type: NOTIFICATION_TYPES.WINNER,
              title: `🎉 প্রাইজবন্ড বিজয়ী: ${win.prizeTitleBn}`,
              message: `আপনার প্রাইজবন্ড #${bond.bondNumber} ${draw.drawNumber}তম ড্র-এ ${win.prizeTitleBn} (৳${taxInfo.grossAmount.toLocaleString()}) জিতেছে!`,
              data: {
                matchId: matchRecord._id,
                drawId: draw._id,
                drawNumber: draw.drawNumber,
                bondNumber: bond.bondNumber,
                amount: taxInfo.grossAmount
              }
            });
          }

          // 5. Dispatch email notification if user enabled email alerts
          if (bond.user.notificationPreferences?.emailOnWin !== false) {
            const emailSent = await emailService.sendWinnerEmail({
              userName: bond.user.name,
              userEmail: bond.user.email,
              userId: bond.user._id,
              bondNumber: bond.bondNumber,
              series: bond.series,
              prizeCategory: win.prizeCategory,
              prizeTitleBn: win.prizeTitleBn,
              prizeTitleEn: win.prizeTitleEn,
              grossAmount: taxInfo.grossAmount,
              estimatedTax: taxInfo.estimatedTax,
              netAmount: taxInfo.netAmount,
              drawNumber: draw.drawNumber,
              drawDate: draw.drawDate.toISOString().split('T')[0]
            });

            await Match.findByIdAndUpdate(matchRecord._id, {
              emailSent,
              emailSentAt: emailSent ? new Date() : null,
              emailDeliveryStatus: emailSent ? 'sent' : 'failed'
            });
          } else {
            await Match.findByIdAndUpdate(matchRecord._id, {
              emailDeliveryStatus: 'skipped'
            });
          }
        }
      }

      const durationMs = Date.now() - startTime;

      // 6. Update Draw with matching statistics
      draw.processingStatus = 'completed';
      draw.matchingStats = {
        totalBondsChecked: totalSystemBonds,
        matchedCount,
        totalPrizeWon,
        durationMs,
        processedAt: new Date()
      };
      await draw.save();

      // 7. Update JobExecution
      await jobExecution.updateOne({
        status: 'completed',
        finishedAt: new Date(),
        durationMs,
        details: {
          drawNumber: draw.drawNumber,
          totalBondsChecked: totalSystemBonds,
          matchedCount,
          totalPrizeWon
        }
      });

      logger.info(
        `[Matching Engine] Completed for Draw ${draw.drawNumber} in ${durationMs}ms: ${matchedCount} wins (৳${totalPrizeWon.toLocaleString()})`
      );

      return {
        drawId: draw._id.toString(),
        drawNumber: draw.drawNumber,
        totalBondsChecked: totalSystemBonds,
        matchedCount,
        totalPrizeWon,
        durationMs,
        matches: recordedMatches
      };
    } catch (error: any) {
      logger.error(`[Matching Engine] Error running matching: ${error.message}`);

      await Draw.findByIdAndUpdate(drawId, {
        processingStatus: 'failed'
      });

      await jobExecution.updateOne({
        status: 'failed',
        finishedAt: new Date(),
        durationMs: Date.now() - startTime,
        error: error.message
      });

      throw error;
    }
  }
};
