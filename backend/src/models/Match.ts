import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IMatch extends Document {
  user: Types.ObjectId;
  bond: Types.ObjectId;
  draw: Types.ObjectId;
  winningNumber: Types.ObjectId;
  bondNumber: string;
  series: string;
  drawNumber: string;
  drawDate: Date;
  prizeCategory: string;
  prizeTitleBn: string;
  prizeTitleEn: string;
  grossAmount: number;
  estimatedTax: number;
  netAmount: number;
  claimDeadline: Date;
  emailSent: boolean;
  emailSentAt?: Date | null;
  emailDeliveryStatus: 'pending' | 'sent' | 'failed' | 'skipped';
  isClaimed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema = new Schema<IMatch>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true
    },
    bond: {
      type: Schema.Types.ObjectId,
      ref: 'PrizeBond',
      required: [true, 'Bond reference is required'],
      index: true
    },
    draw: {
      type: Schema.Types.ObjectId,
      ref: 'Draw',
      required: [true, 'Draw reference is required'],
      index: true
    },
    winningNumber: {
      type: Schema.Types.ObjectId,
      ref: 'WinningNumber',
      required: [true, 'Winning number reference is required']
    },
    bondNumber: {
      type: String,
      required: true,
      index: true
    },
    series: {
      type: String,
      default: ''
    },
    drawNumber: {
      type: String,
      required: true,
      index: true
    },
    drawDate: {
      type: Date,
      required: true,
      index: true
    },
    prizeCategory: {
      type: String,
      required: true
    },
    prizeTitleBn: {
      type: String,
      required: true
    },
    prizeTitleEn: {
      type: String,
      required: true
    },
    grossAmount: {
      type: Number,
      required: true
    },
    estimatedTax: {
      type: Number,
      required: true
    },
    netAmount: {
      type: Number,
      required: true
    },
    claimDeadline: {
      type: Date,
      required: true
    },
    emailSent: {
      type: Boolean,
      default: false
    },
    emailSentAt: {
      type: Date,
      default: null
    },
    emailDeliveryStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'skipped'],
      default: 'pending'
    },
    isClaimed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Enforce unique idempotency: Same draw, user, bond, and prize category can NEVER be duplicated!
MatchSchema.index({ draw: 1, user: 1, bond: 1, prizeCategory: 1 }, { unique: true });
MatchSchema.index({ user: 1, drawDate: -1 });

export const Match: Model<IMatch> = mongoose.models.Match || mongoose.model<IMatch>('Match', MatchSchema);
