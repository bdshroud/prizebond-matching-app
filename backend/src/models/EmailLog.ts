import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IEmailLog extends Document {
  recipientEmail: string;
  user?: Types.ObjectId | null;
  subject: string;
  template: string;
  status: 'sent' | 'failed' | 'retrying';
  attempts: number;
  lastError?: string | null;
  sentAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const EmailLogSchema = new Schema<IEmailLog>(
  {
    recipientEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    subject: {
      type: String,
      required: true
    },
    template: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['sent', 'failed', 'retrying'],
      default: 'sent',
      index: true
    },
    attempts: {
      type: Number,
      default: 1
    },
    lastError: {
      type: String,
      default: null
    },
    sentAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

EmailLogSchema.index({ status: 1, createdAt: -1 });

export const EmailLog: Model<IEmailLog> =
  mongoose.models.EmailLog || mongoose.model<IEmailLog>('EmailLog', EmailLogSchema);
