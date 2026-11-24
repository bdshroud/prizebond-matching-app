import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IJobExecution extends Document {
  jobName: string;
  status: 'running' | 'completed' | 'failed';
  startedAt: Date;
  finishedAt?: Date | null;
  durationMs?: number;
  details?: Record<string, any>;
  error?: string | null;
  retryCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const JobExecutionSchema = new Schema<IJobExecution>(
  {
    jobName: {
      type: String,
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['running', 'completed', 'failed'],
      default: 'running',
      index: true
    },
    startedAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    finishedAt: {
      type: Date,
      default: null
    },
    durationMs: {
      type: Number,
      default: 0
    },
    details: {
      type: Schema.Types.Mixed,
      default: {}
    },
    error: {
      type: String,
      default: null
    },
    retryCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

JobExecutionSchema.index({ jobName: 1, startedAt: -1 });

export const JobExecution: Model<IJobExecution> =
  mongoose.models.JobExecution || mongoose.model<IJobExecution>('JobExecution', JobExecutionSchema);
