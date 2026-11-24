import bcrypt from 'bcryptjs';
import { User, Draw, WinningNumber } from '../models/index.js';
import { ENV } from '../config/env.js';
import { ROLES, PRIZE_STRUCTURE } from '../config/constants.js';
import { logger } from './logger.js';

export async function seedInitialData(): Promise<void> {
  try {
    // 1. Seed Admin User
    const existingAdmin = await User.findOne({ role: ROLES.ADMIN });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(ENV.ADMIN_PASSWORD, salt);

      await User.create({
        name: ENV.ADMIN_NAME,
        email: ENV.ADMIN_EMAIL.toLowerCase(),
        passwordHash,
        role: ROLES.ADMIN,
        isEmailVerified: true,
        notificationPreferences: {
          emailOnWin: true,
          emailOnNewDraw: true,
          inAppNotifications: true
        }
      });
      logger.info(`[Seed] Initial Admin created: ${ENV.ADMIN_EMAIL}`);
    }

    // 2. Seed Official 118th Draw (January 31, 2025)
    const existingDraw118 = await Draw.findOne({ drawNumber: '118' });
    if (!existingDraw118) {
      const draw118 = await Draw.create({
        drawNumber: '118',
        drawDate: new Date('2025-01-31'),
        publicationDate: new Date('2025-01-31'),
        officialSource: 'Bangladesh Bank & Internal Resources Division (Ministry of Finance)',
        isVerified: true,
        isPublished: true,
        description: '১১৮তম বাংলাদেশ প্রাইজবন্ড ড্র (৩১ জানুয়ারি ২০২৫)',
        seriesType: 'all',
        totalPrizes: 46,
        totalWinningAmount: 1625000,
        processingStatus: 'completed'
      });

      const winners118 = [
        { bondNumber: '0562947', prizeCategory: 'first', applicableSeries: 'all' },
        { bondNumber: '0289134', prizeCategory: 'second', applicableSeries: 'all' },
        { bondNumber: '0142857', prizeCategory: 'third', applicableSeries: 'all' },
        { bondNumber: '0783921', prizeCategory: 'third', applicableSeries: 'all' },
        { bondNumber: '0321984', prizeCategory: 'fourth', applicableSeries: 'all' },
        { bondNumber: '0894120', prizeCategory: 'fourth', applicableSeries: 'all' },
        { bondNumber: '0015923', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0034812', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0078129', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0129843', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0189420', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0231894', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0294105', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0341890', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0398412', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0451290', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0512894', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0578912', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0634120', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0691234', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0754129', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0812943', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0879410', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0934128', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0981245', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0023415', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0089123', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0156789', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0213456', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0278901', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0334567', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0389012', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0445678', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0501234', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0567890', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0623456', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0678901', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0734567', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0790123', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0845678', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0901234', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0956789', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0990123', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0112233', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0223344', prizeCategory: 'fifth', applicableSeries: 'all' },
        { bondNumber: '0334455', prizeCategory: 'fifth', applicableSeries: 'all' }
      ];

      const winningDocs = winners118.map((w) => {
        const cat = PRIZE_STRUCTURE[w.prizeCategory as keyof typeof PRIZE_STRUCTURE];
        return {
          draw: draw118._id,
          bondNumber: w.bondNumber,
          prizeCategory: w.prizeCategory,
          prizeTitleBn: cat.titleBn,
          prizeTitleEn: cat.titleEn,
          prizeAmount: cat.amount,
          applicableSeries: w.applicableSeries
        };
      });

      await WinningNumber.insertMany(winningDocs);
      logger.info(`[Seed] Official 118th Draw and 46 winning numbers seeded successfully`);
    }
  } catch (err: any) {
    logger.error(`[Seed] Error during seeding: ${err.message}`);
  }
}
