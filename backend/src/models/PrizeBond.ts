import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IPrizeBond extends Document {
  user: Types.ObjectId;
  bondNumber: string;
  series: string;
  purchaseDate?: Date | null;
  notes?: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PrizeBondSchema = new Schema<IPrizeBond>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ownership is required'],
      index: true
    },
    bondNumber: {
      type: String,
      required: [true, 'Bond number is required'],
      trim: true,
      minlength: [7, 'Bangladesh Prize Bond number must be 7 digits'],
      maxlength: [7, 'Bangladesh Prize Bond number must be 7 digits'],
      index: true
    },
    series: {
      type: String,
      default: '',
      trim: true
    },
    purchaseDate: {
      type: Date,
      default: null,
      index: true
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: ''
    },
    isEnabled: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate bond per user and series
PrizeBondSchema.index({ user: 1, bondNumber: 1, series: 1 }, { unique: true });
PrizeBondSchema.index({ bondNumber: 1, isEnabled: 1 });

export const PrizeBond: Model<IPrizeBond> =
  mongoose.models.PrizeBond || mongoose.model<IPrizeBond>('PrizeBond', PrizeBondSchema);
