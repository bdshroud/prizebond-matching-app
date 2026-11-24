import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Match } from '../models/Match.js';
import { Draw } from '../models/Draw.js';
import { WinningNumber } from '../models/WinningNumber.js';
import { calculatePrizeTax } from '../utils/taxCalculator.js';
import { BOND_NUMBER_REGEX } from '../config/constants.js';

export const matchingController = {
  checkBondsInstant: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rawNumbers: string[] = Array.isArray(req.body.numbers)
        ? req.body.numbers
        : typeof req.body.numbers === 'string'
        ? req.body.numbers.split(/[\s,]+/)
        : [];
      
      const series = req.body.series ? String(req.body.series).trim().toUpperCase() : undefined;
      const drawId = req.body.drawId ? String(req.body.drawId).trim() : undefined;

      const normalizedNumbers = rawNumbers
        .map((n) => String(n).trim().replace(/\D/g, ''))
        .filter((n) => n.length > 0)
        .map((n) => n.padStart(7, '0'))
        .filter((n) => BOND_NUMBER_REGEX.test(n));

      const uniqueNumbers = Array.from(new Set(normalizedNumbers));

      if (uniqueNumbers.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Please provide at least one valid 7-digit bond number (e.g. 0123456)'
        });
        return;
      }

      // Find published & verified draws
      const drawFilter: Record<string, any> = { isPublished: true, isVerified: true };
      if (drawId && drawId !== 'all') {
        drawFilter._id = drawId;
      }

      const draws = await Draw.find(drawFilter).sort({ drawDate: -1 }).limit(50);
      const drawIds = draws.map((d) => d._id);

      if (drawIds.length === 0) {
        res.status(200).json({
          success: true,
          data: {
            wins: [],
            checkedNumbers: uniqueNumbers,
            totalChecked: uniqueNumbers.length,
            totalWins: 0,
            totalGross: 0,
            totalTax: 0,
            totalNet: 0,
            message: 'No published draws available to check against'
          }
        });
        return;
      }

      // Query winning numbers
      const winningNumbers = await WinningNumber.find({
        draw: { $in: drawIds },
        bondNumber: { $in: uniqueNumbers }
      }).populate('draw');

      const wins: Array<{
        bondNumber: string;
        series: string;
        prizeCategory: string;
        prizeAmount: number;
        estimatedTax: number;
        estimatedNet: number;
        drawId: string;
        drawNumber: string;
        drawDate: Date;
        description: string;
      }> = [];

      for (const wn of winningNumbers) {
        const draw = wn.draw as any;
        if (!draw) continue;

        // Series matching logic
        const wnSeries = (wn.applicableSeries || 'all').toLowerCase();
        if (series && wnSeries !== 'all' && wnSeries !== series.toLowerCase()) {
          continue; // Series specific mismatch
        }

        const { estimatedTax, netAmount } = calculatePrizeTax(wn.prizeAmount);

        wins.push({
          bondNumber: wn.bondNumber,
          series: series || wn.applicableSeries || 'All',
          prizeCategory: wn.prizeCategory,
          prizeAmount: wn.prizeAmount,
          estimatedTax,
          estimatedNet: netAmount,
          drawId: String(draw._id),
          drawNumber: draw.drawNumber,
          drawDate: draw.drawDate,
          description: wn.prizeTitleEn || `${wn.prizeCategory} Prize`
        });
      }

      const totalGross = wins.reduce((sum, w) => sum + w.prizeAmount, 0);
      const totalTax = wins.reduce((sum, w) => sum + w.estimatedTax, 0);
      const totalNet = wins.reduce((sum, w) => sum + w.estimatedNet, 0);

      res.status(200).json({
        success: true,
        data: {
          wins,
          checkedNumbers: uniqueNumbers,
          totalChecked: uniqueNumbers.length,
          totalWins: wins.length,
          totalGross,
          totalTax,
          totalNet
        }
      });
    } catch (err) {
      next(err);
    }
  },

  getMatchHistory: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
      const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || '20'), 10)));
      const skip = (page - 1) * limit;

      const filter: Record<string, any> = { user: req.user!._id };

      if (req.query.search) {
        const s = new RegExp(String(req.query.search).trim(), 'i');
        filter.$or = [{ bondNumber: s }, { drawNumber: s }, { prizeCategory: s }];
      }

      if (req.query.drawNumber) {
        filter.drawNumber = String(req.query.drawNumber).trim();
      }

      if (req.query.prizeCategory) {
        filter.prizeCategory = String(req.query.prizeCategory).trim();
      }

      const [matches, total] = await Promise.all([
        Match.find(filter).sort({ drawDate: -1, grossAmount: -1 }).skip(skip).limit(limit),
        Match.countDocuments(filter)
      ]);

      const totalWon = await Match.aggregate([
        { $match: { user: req.user!._id } },
        { $group: { _id: null, totalGross: { $sum: '$grossAmount' }, totalNet: { $sum: '$netAmount' } } }
      ]);

      res.status(200).json({
        success: true,
        data: {
          matches,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          summary: {
            totalGross: totalWon[0]?.totalGross || 0,
            totalNet: totalWon[0]?.totalNet || 0
          }
        }
      });
    } catch (err) {
      next(err);
    }
  },

  getMatchById: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const match = await Match.findOne({ _id: req.params.id, user: req.user!._id })
        .populate('bond')
        .populate('draw');

      if (!match) {
        res.status(404).json({ success: false, message: 'Winning match record not found' });
        return;
      }

      res.status(200).json({
        success: true,
        data: match
      });
    } catch (err) {
      next(err);
    }
  }
};
