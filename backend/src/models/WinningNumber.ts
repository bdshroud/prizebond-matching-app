import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import { PrizeCategory } from '../config/constants.js';

export interface IWinningNumber extends Document {
  draw: Types.ObjectId;
  bondNumber: string;
  prizeCategory: PrizeCategory;
  prizeTitleBn: string;
  prizeTitleEn: string;
  prizeAmount: number;
  applicableSeries: string;
  createdAt: Date;
  updatedAt: Date;
}

const WinningNumberSchema = new Schema<IWinningNumber>(
  {
    draw: {
      type: Schema.Types.ObjectId,
      ref: 'Draw',
      required: [true, 'Draw reference is required'],
      index: true
    },
    bondNumber: {
      type: String,
      required: [true, 'Winning bond number is required'],
      trim: true,
      minlength: 7,
      maxlength: 7,
      index: true
    },
    prizeCategory: {
      type: String,
      enum: ['first', 'second', 'third', 'fourth', 'fifth'],
      required: true,
      index: true
    },
    prizeTitleBn: {
      type: String,
      required: true
    },
    prizeTitleEn: {
      type: String,
      required: true
    },
    prizeAmount: {
      type: Number,
      required: true
    },
    applicableSeries: {
      type: String,
      default: 'all',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

WinningNumberSchema.index({ draw: 1, bondNumber: 1, applicableSeries: 1 });
WinningNumberSchema.index({ draw: 1, prizeAmount: -1 });

export const WinningNumber: Model<IWinningNumber> =
  mongoose.models.WinningNumber || mongoose.model<IWinningNumber>('WinningNumber', WinningNumberSchema);
