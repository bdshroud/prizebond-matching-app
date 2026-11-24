import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { notificationService } from '../services/notification.service.js';

export const notificationController = {
  getNotifications: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(String(req.query.page || '1'), 10);
      const limit = parseInt(String(req.query.limit || '20'), 10);
      const unreadOnly = req.query.unreadOnly === 'true';

      const result = await notificationService.getUserNotifications(
        req.user!._id.toString(),
        { page, limit, unreadOnly }
      );

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  markAsRead: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const notification = await notificationService.markAsRead(
        id,
        req.user!._id.toString()
      );
      res.status(200).json({
        success: true,
        data: notification
      });
    } catch (err) {
      next(err);
    }
  },

  markAllAsRead: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await notificationService.markAllAsRead(req.user!._id.toString());
      res.status(200).json({
        success: true,
        message: 'All notifications marked as read'
      });
    } catch (err) {
      next(err);
    }
  },

  deleteNotification: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      await notificationService.deleteNotification(id, req.user!._id.toString());
      res.status(200).json({
        success: true,
        message: 'Notification deleted'
      });
    } catch (err) {
      next(err);
    }
  }
};
