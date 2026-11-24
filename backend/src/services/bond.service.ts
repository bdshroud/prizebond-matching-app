import { PrizeBond, IPrizeBond } from '../models/PrizeBond.js';
import { Types } from 'mongoose';
import { BOND_NUMBER_REGEX } from '../config/constants.js';

export interface IGetBondsQuery {
  page?: number;
  limit?: number;
  search?: string;
  series?: string;
  isEnabled?: boolean;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export const bondService = {
  /**
   * Add a single prize bond for an authenticated user
   */
  addBond: async (
    userId: string | Types.ObjectId,
    data: {
      bondNumber: string;
      series?: string;
      purchaseDate?: string | Date | null;
      notes?: string;
    }
  ): Promise<IPrizeBond> => {
    const cleanNumber = String(data.bondNumber).trim();
    const cleanSeries = String(data.series || '').trim();

    // Check for existing duplicate bond for this user and series
    const existing = await PrizeBond.findOne({
      user: userId,
      bondNumber: cleanNumber,
      series: cleanSeries
    });

    if (existing) {
      throw new Error(`Prize bond #${cleanNumber}${cleanSeries ? ` (${cleanSeries})` : ''} already exists in your portfolio`);
    }

    return PrizeBond.create({
      user: userId,
      bondNumber: cleanNumber,
      series: cleanSeries,
      purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
      notes: data.notes || '',
      isEnabled: true
    });
  },

  /**
   * Bulk add bonds with automatic deduplication
   */
  bulkAddBonds: async (
    userId: string | Types.ObjectId,
    bondsList: Array<{
      bondNumber: string;
      series?: string;
      purchaseDate?: string | Date | null;
      notes?: string;
    }>
  ) => {
    let addedCount = 0;
    let duplicateCount = 0;
    const errors: string[] = [];

    // Deduplicate within the incoming batch first
    const uniqueBatch = new Map<string, typeof bondsList[0]>();
    for (const item of bondsList) {
      const num = String(item.bondNumber || '').trim();
      const ser = String(item.series || '').trim();
      if (!BOND_NUMBER_REGEX.test(num)) {
        errors.push(`Invalid 7-digit bond number format: ${num}`);
        continue;
      }
      const key = `${num}_${ser}`;
      if (!uniqueBatch.has(key)) {
        uniqueBatch.set(key, item);
      } else {
        duplicateCount++;
      }
    }

    const itemsToInsert = Array.from(uniqueBatch.values());

    for (const item of itemsToInsert) {
      const num = String(item.bondNumber).trim();
      const ser = String(item.series || '').trim();

      try {
        const exists = await PrizeBond.findOne({
          user: userId,
          bondNumber: num,
          series: ser
        });

        if (exists) {
          duplicateCount++;
          continue;
        }

        await PrizeBond.create({
          user: userId,
          bondNumber: num,
          series: ser,
          purchaseDate: item.purchaseDate ? new Date(item.purchaseDate) : null,
          notes: item.notes || '',
          isEnabled: true
        });

        addedCount++;
      } catch (err: any) {
        errors.push(`Failed to add #${num}: ${err.message}`);
      }
    }

    return {
      success: true,
      addedCount,
      duplicateCount,
      errors
    };
  },

  /**
   * Query user's bonds with pagination, search, and filtering
   */
  getBonds: async (userId: string | Types.ObjectId, query: IGetBondsQuery) => {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = { user: userId };

    if (query.search) {
      const searchRegex = new RegExp(query.search.trim(), 'i');
      filter.$or = [
        { bondNumber: searchRegex },
        { series: searchRegex },
        { notes: searchRegex }
      ];
    }

    if (query.series) {
      filter.series = query.series.trim();
    }

    if (typeof query.isEnabled === 'boolean') {
      filter.isEnabled = query.isEnabled;
    }

    const sortField = query.sortBy || 'createdAt';
    const sortOrder = query.order === 'asc' ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortField]: sortOrder };

    const [bonds, total] = await Promise.all([
      PrizeBond.find(filter).sort(sort).skip(skip).limit(limit),
      PrizeBond.countDocuments(filter)
    ]);

    return {
      bonds,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  },

  getBondById: async (userId: string | Types.ObjectId, bondId: string) => {
    const bond = await PrizeBond.findOne({ _id: bondId, user: userId });
    if (!bond) {
      throw new Error('Prize bond not found or unauthorized');
    }
    return bond;
  },

  updateBond: async (
    userId: string | Types.ObjectId,
    bondId: string,
    data: {
      bondNumber?: string;
      series?: string;
      purchaseDate?: string | Date | null;
      notes?: string;
      isEnabled?: boolean;
    }
  ) => {
    const bond = await PrizeBond.findOne({ _id: bondId, user: userId });
    if (!bond) {
      throw new Error('Prize bond not found or unauthorized');
    }

    if (data.bondNumber) bond.bondNumber = data.bondNumber.trim();
    if (data.series !== undefined) bond.series = data.series.trim();
    if (data.purchaseDate !== undefined) {
      bond.purchaseDate = data.purchaseDate ? new Date(data.purchaseDate) : null;
    }
    if (data.notes !== undefined) bond.notes = data.notes.trim();
    if (data.isEnabled !== undefined) bond.isEnabled = data.isEnabled;

    await bond.save();
    return bond;
  },

  deleteBond: async (userId: string | Types.ObjectId, bondId: string) => {
    const result = await PrizeBond.findOneAndDelete({ _id: bondId, user: userId });
    if (!result) {
      throw new Error('Prize bond not found or unauthorized');
    }
    return { success: true, message: 'Bond deleted successfully' };
  },

  deleteBonds: async (userId: string | Types.ObjectId, bondIds: string[]) => {
    const result = await PrizeBond.deleteMany({
      _id: { $in: bondIds },
      user: userId
    });
    return { success: true, deletedCount: result.deletedCount };
  },

  /**
   * Export all user's bonds to CSV format
   */
  exportBondsCSV: async (userId: string | Types.ObjectId): Promise<string> => {
    const bonds = await PrizeBond.find({ user: userId }).sort({ createdAt: -1 });

    let csv = 'Bond Number,Series,Purchase Date,Notes,Status,Created At\n';
    for (const b of bonds) {
      const pDate = b.purchaseDate ? b.purchaseDate.toISOString().split('T')[0] : '';
      const cDate = b.createdAt ? b.createdAt.toISOString().split('T')[0] : '';
      const status = b.isEnabled ? 'Active' : 'Disabled';
      const cleanNotes = (b.notes || '').replace(/"/g, '""');

      csv += `"${b.bondNumber}","${b.series || ''}","${pDate}","${cleanNotes}","${status}","${cDate}"\n`;
    }

    return csv;
  },

  /**
   * Parse CSV content and bulk import bonds
   */
  importBondsCSV: async (userId: string | Types.ObjectId, csvContent: string) => {
    const lines = csvContent.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      throw new Error('Uploaded CSV file is empty');
    }

    const startIndex = lines[0].toLowerCase().includes('bond') || lines[0].toLowerCase().includes('number') ? 1 : 0;
    const bondsToInsert: Array<{
      bondNumber: string;
      series?: string;
      purchaseDate?: string | null;
      notes?: string;
    }> = [];

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      // Regex CSV parse handling commas inside quotes
      const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((p) => p.replace(/^"|"$/g, '').trim());

      const num = parts[0];
      const series = parts[1] || '';
      const purchaseDate = parts[2] || null;
      const notes = parts[3] || '';

      if (num && BOND_NUMBER_REGEX.test(num)) {
        bondsToInsert.push({
          bondNumber: num,
          series,
          purchaseDate,
          notes
        });
      }
    }

    return bondService.bulkAddBonds(userId, bondsToInsert);
  }
};
