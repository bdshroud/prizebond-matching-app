import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { AuthRequest } from '../middleware/auth.js';

export const authController = {
  register: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'Registration successful. Please verify your email.',
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  getMe: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await authService.getProfile(req.user!._id.toString());
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (err) {
      next(err);
    }
  },

  updateProfile: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await authService.updateProfile(req.user!._id.toString(), req.body);
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user
      });
    } catch (err) {
      next(err);
    }
  },

  changePassword: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await authService.changePassword(
        req.user!._id.toString(),
        currentPassword,
        newPassword
      );
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  forgotPassword: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await authService.forgotPassword(req.body.email);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  resetPassword: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token, password } = req.body;
      const result = await authService.resetPassword(token, password);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  verifyEmail: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.body;
      const result = await authService.verifyEmail(token);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
};
