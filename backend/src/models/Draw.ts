import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IMatchingStats {
  totalBondsChecked: number;
  matchedCount: number;
  totalPrizeWon: number;
  durationMs?: number;
  processedAt?: Date | null;
}

export interface IDraw extends Document {
  drawNumber: string;
  drawDate: Date;
  publicationDate: Date;
  officialSource: string;
  isVerified: boolean;
  isPublished: boolean;
  description: string;
  seriesType: string;
  totalPrizes: number;
  totalWinningAmount: number;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  matchingStats: IMatchingStats;
  createdAt: Date;
  updatedAt: Date;
}

const DrawSchema = new Schema<IDraw>(
  {
    drawNumber: {
      type: String,
      required: [true, 'Draw number is required'],
      unique: true,
      trim: true,
      index: true
    },
    drawDate: {
      type: Date,
      required: [true, 'Official draw date is required'],
      index: true
    },
    publicationDate: {
      type: Date,
      default: Date.now
    },
    officialSource: {
      type: String,
      default: 'Bangladesh Bank & Internal Resources Division (Ministry of Finance)',
      trim: true
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    seriesType: {
      type: String,
      default: 'all',
      trim: true
    },
    totalPrizes: {
      type: Number,
      default: 0
    },
    totalWinningAmount: {
      type: Number,
      default: 0
    },
    processingStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
      index: true
    },
    matchingStats: {
      totalBondsChecked: { type: Number, default: 0 },
      matchedCount: { type: Number, default: 0 },
      totalPrizeWon: { type: Number, default: 0 },
      durationMs: { type: Number, default: 0 },
      processedAt: { type: Date, default: null }
    }
  },
  {
    timestamps: true
  }
);

DrawSchema.index({ drawDate: -1, isPublished: 1 });

export const Draw: Model<IDraw> = mongoose.models.Draw || mongoose.model<IDraw>('Draw', DrawSchema);
