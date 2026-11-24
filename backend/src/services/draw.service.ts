import { Draw, IDraw } from '../models/Draw.js';
import { WinningNumber, IWinningNumber } from '../models/WinningNumber.js';
import { matchingService } from './matching.service.js';
import { PRIZE_STRUCTURE, PrizeCategory, BOND_NUMBER_REGEX } from '../config/constants.js';
import { Types } from 'mongoose';

export const drawService = {
  createDraw: async (data: {
    drawNumber: string;
    drawDate: string | Date;
    publicationDate?: string | Date;
    officialSource?: string;
    description?: string;
    seriesType?: string;
  }): Promise<IDraw> => {
    const cleanNumber = String(data.drawNumber).trim();
    const existing = await Draw.findOne({ drawNumber: cleanNumber });
    if (existing) {
      throw new Error(`Draw number ${cleanNumber} already exists`);
    }

    return Draw.create({
      drawNumber: cleanNumber,
      drawDate: new Date(data.drawDate),
      publicationDate: data.publicationDate ? new Date(data.publicationDate) : new Date(),
      officialSource: data.officialSource || 'Bangladesh Bank & Internal Resources Division (Ministry of Finance)',
      description: data.description || '',
      seriesType: data.seriesType || 'all',
      isVerified: false,
      isPublished: false,
      processingStatus: 'pending'
    });
  },

  getDraws: async (
    query: {
      page?: number;
      limit?: number;
      search?: string;
      year?: number;
      isPublished?: boolean;
    },
    isAdmin = false
  ) => {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (!isAdmin) {
      filter.isPublished = true;
      filter.isVerified = true;
    } else if (typeof query.isPublished === 'boolean') {
      filter.isPublished = query.isPublished;
    }

    if (query.search) {
      const s = new RegExp(query.search.trim(), 'i');
      filter.$or = [{ drawNumber: s }, { description: s }];
    }

    if (query.year) {
      const start = new Date(`${query.year}-01-01T00:00:00.000Z`);
      const end = new Date(`${query.year}-12-31T23:59:59.999Z`);
      filter.drawDate = { $gte: start, $lte: end };
    }

    const [draws, total] = await Promise.all([
      Draw.find(filter).sort({ drawDate: -1 }).skip(skip).limit(limit),
      Draw.countDocuments(filter)
    ]);

    return {
      draws,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  },

  getDrawById: async (id: string, isAdmin = false) => {
    const filter: Record<string, any> = { _id: id };
    if (!isAdmin) {
      filter.isPublished = true;
      filter.isVerified = true;
    }

    const draw = await Draw.findOne(filter);
    if (!draw) {
      throw new Error('Draw not found or unpublished');
    }

    const winningNumbers = await WinningNumber.find({ draw: draw._id }).sort({
      prizeAmount: -1,
      bondNumber: 1
    });

    return {
      draw,
      winningNumbers,
      winnerCount: winningNumbers.length
    };
  },

  updateDraw: async (id: string, data: Partial<IDraw>) => {
    const draw = await Draw.findById(id);
    if (!draw) {
      throw new Error('Draw not found');
    }

    if (data.drawNumber) draw.drawNumber = String(data.drawNumber).trim();
    if (data.drawDate) draw.drawDate = new Date(data.drawDate);
    if (data.publicationDate) draw.publicationDate = new Date(data.publicationDate);
    if (data.officialSource !== undefined) draw.officialSource = data.officialSource.trim();
    if (data.description !== undefined) draw.description = data.description.trim();
    if (data.seriesType !== undefined) draw.seriesType = data.seriesType.trim();
    if (data.isVerified !== undefined) draw.isVerified = data.isVerified;
    if (data.isPublished !== undefined) draw.isPublished = data.isPublished;

    await draw.save();
    return draw;
  },

  deleteDraw: async (id: string) => {
    const draw = await Draw.findByIdAndDelete(id);
    if (!draw) {
      throw new Error('Draw not found');
    }
    await WinningNumber.deleteMany({ draw: id });
    return { success: true, message: 'Draw and associated winning numbers deleted' };
  },

  addWinningNumbers: async (
    drawId: string,
    winnersList: Array<{
      bondNumber: string;
      prizeCategory: PrizeCategory;
      applicableSeries?: string;
      prizeAmount?: number;
    }>
  ) => {
    const draw = await Draw.findById(drawId);
    if (!draw) {
      throw new Error('Draw not found');
    }

    const docsToInsert = [];
    let totalPrizeWon = 0;

    for (const item of winnersList) {
      const num = String(item.bondNumber).trim();
      if (!BOND_NUMBER_REGEX.test(num)) {
        continue;
      }

      const catInfo = PRIZE_STRUCTURE[item.prizeCategory];
      if (!catInfo) continue;

      const amount = item.prizeAmount || catInfo.amount;
      totalPrizeWon += amount;

      docsToInsert.push({
        draw: draw._id,
        bondNumber: num,
        prizeCategory: item.prizeCategory,
        prizeTitleBn: catInfo.titleBn,
        prizeTitleEn: catInfo.titleEn,
        prizeAmount: amount,
        applicableSeries: item.applicableSeries || 'all'
      });
    }

    if (docsToInsert.length > 0) {
      await WinningNumber.insertMany(docsToInsert);
    }

    // Update draw summary statistics
    const totalWinnersCount = await WinningNumber.countDocuments({ draw: draw._id });
    draw.totalPrizes = totalWinnersCount;
    draw.totalWinningAmount = totalPrizeWon;
    await draw.save();

    return {
      success: true,
      addedCount: docsToInsert.length,
      totalWinnersCount
    };
  },

  importWinningNumbersCSV: async (drawId: string, csvContent: string) => {
    const lines = csvContent.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      throw new Error('Uploaded winning numbers CSV is empty');
    }

    const startIndex = lines[0].toLowerCase().includes('bond') || lines[0].toLowerCase().includes('prize') ? 1 : 0;
    const items: Array<{
      bondNumber: string;
      prizeCategory: PrizeCategory;
      applicableSeries?: string;
      prizeAmount?: number;
    }> = [];

    for (let i = startIndex; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.replace(/^"|"$/g, '').trim());
      const num = parts[0];
      const cat = (parts[1] || 'fifth').toLowerCase() as PrizeCategory;
      const ser = parts[2] || 'all';
      const amt = parts[3] ? parseFloat(parts[3]) : undefined;

      if (num && BOND_NUMBER_REGEX.test(num) && PRIZE_STRUCTURE[cat]) {
        items.push({
          bondNumber: num,
          prizeCategory: cat,
          applicableSeries: ser,
          prizeAmount: amt
        });
      }
    }

    return drawService.addWinningNumbers(drawId, items);
  },

  /**
   * Admin verifies and publishes draw, automatically executing the matching engine
   */
  publishAndVerifyDraw: async (drawId: string) => {
    const draw = await Draw.findById(drawId);
    if (!draw) {
      throw new Error('Draw not found');
    }

    draw.isVerified = true;
    draw.isPublished = true;
    await draw.save();

    // Automatically trigger the matching engine job
    const matchingResult = await matchingService.runMatchingForDraw(draw._id);

    return {
      success: true,
      draw,
      matchingResult
    };
  }
};
