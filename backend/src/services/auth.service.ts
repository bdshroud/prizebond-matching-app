import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User, IUser } from '../models/User.js';
import { signToken } from '../utils/jwt.js';
import { ROLES } from '../config/constants.js';
import { emailService } from './email.service.js';
import { ENV } from '../config/env.js';

export const authService = {
  register: async (data: { name: string; email: string; password: string }) => {
    const cleanEmail = data.email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      throw new Error('An account with this email address already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await User.create({
      name: data.name.trim(),
      email: cleanEmail,
      passwordHash,
      role: ROLES.USER,
      isEmailVerified: false,
      verificationToken,
      verificationTokenExpires,
      notificationPreferences: {
        emailOnWin: true,
        emailOnNewDraw: true,
        inAppNotifications: true
      }
    });

    // Send verification email
    const verifyUrl = `${ENV.CLIENT_URL}/verify-email?token=${verificationToken}`;
    await emailService.sendMail({
      to: cleanEmail,
      userId: user._id,
      subject: 'Verify your Bangladesh Prize Bond Account',
      template: 'email_verification',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Welcome to Bangladesh Prize Bond Platform!</h2>
          <p>Please click the button below to verify your email address:</p>
          <a href="${verifyUrl}" style="background: #2563eb; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">Verify Email</a>
          <p style="margin-top: 16px; font-size: 12px; color: #64748b;">Or copy this URL: ${verifyUrl}</p>
        </div>
      `
    });

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        notificationPreferences: user.notificationPreferences
      }
    };
  },

  login: async (email: string, password: string) => {
    const cleanEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: cleanEmail }).select('+passwordHash');
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        notificationPreferences: user.notificationPreferences
      }
    };
  },

  getProfile: async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      notificationPreferences: user.notificationPreferences,
      createdAt: user.createdAt
    };
  },

  updateProfile: async (userId: string, data: { name?: string; notificationPreferences?: any }) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (data.name) user.name = data.name.trim();
    if (data.notificationPreferences) {
      user.notificationPreferences = {
        ...user.notificationPreferences,
        ...data.notificationPreferences
      };
    }

    await user.save();
    return user;
  },

  changePassword: async (userId: string, currentPass: string, newPass: string) => {
    const user = await User.findById(userId).select('+passwordHash');
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await user.comparePassword(currentPass);
    if (!isMatch) {
      throw new Error('Incorrect current password');
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPass, salt);
    await user.save();

    return { success: true, message: 'Password changed successfully' };
  },

  forgotPassword: async (email: string) => {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Return success to avoid email enumeration attacks
      return { success: true, message: 'If an account exists, a password reset link has been sent.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const resetUrl = `${ENV.CLIENT_URL}/reset-password?token=${resetToken}`;
    await emailService.sendMail({
      to: user.email,
      userId: user._id,
      subject: 'Reset your Bangladesh Prize Bond Password',
      template: 'password_reset',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset. Please click the button below to set a new password:</p>
          <a href="${resetUrl}" style="background: #2563eb; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">Reset Password</a>
          <p style="margin-top: 16px; font-size: 12px; color: #64748b;">This link will expire in 1 hour.</p>
        </div>
      `
    });

    return { success: true, message: 'If an account exists, a password reset link has been sent.' };
  },

  resetPassword: async (token: string, newPass: string) => {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      throw new Error('Invalid or expired password reset token');
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPass, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return { success: true, message: 'Password has been reset successfully. You can now log in.' };
  },

  verifyEmail: async (token: string) => {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() }
    }).select('+verificationToken +verificationTokenExpires');

    if (!user) {
      throw new Error('Invalid or expired email verification token');
    }

    user.isEmailVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    return { success: true, message: 'Email address successfully verified!' };
  }
};
