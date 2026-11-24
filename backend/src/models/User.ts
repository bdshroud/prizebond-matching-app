import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES, Role } from '../config/constants.js';

export interface INotificationPreferences {
  emailOnWin: boolean;
  emailOnNewDraw: boolean;
  inAppNotifications: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  image?: string;
  role: Role;
  isEmailVerified: boolean;
  verificationToken?: string | null;
  verificationTokenExpires?: Date | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  notificationPreferences: INotificationPreferences;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name must be under 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: false,
      select: false
    },
    image: {
      type: String,
      default: null
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
      index: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: {
      type: String,
      select: false,
      default: null
    },
    verificationTokenExpires: {
      type: Date,
      select: false,
      default: null
    },
    resetPasswordToken: {
      type: String,
      select: false,
      default: null
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
      default: null
    },
    notificationPreferences: {
      emailOnWin: { type: Boolean, default: true },
      emailOnNewDraw: { type: Boolean, default: true },
      inAppNotifications: { type: Boolean, default: true }
    },
    lastLoginAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Method to verify candidate password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
