import { Notification, INotification } from '../models/Notification.js';
import { NOTIFICATION_TYPES, NotificationType } from '../config/constants.js';
import { Types } from 'mongoose';

export const notificationService = {
  createNotification: async (params: {
    userId: Types.ObjectId | string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, any>;
  }): Promise<INotification> => {
    return Notification.create({
      user: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      data: params.data || {}
    });
  },

  getUserNotifications: async (
    userId: string,
    query: { page?: number; limit?: number; unreadOnly?: boolean }
  ) => {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = { user: userId };
    if (query.unreadOnly) {
      filter.isRead = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments(filter),
      Notification.countDocuments({ user: userId, isRead: false })
    ]);

    return {
      notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      unreadCount
    };
  },

  markAsRead: async (notificationId: string, userId: string) => {
    return Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
  },

  markAllAsRead: async (userId: string) => {
    return Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
  },

  deleteNotification: async (notificationId: string, userId: string) => {
    return Notification.findOneAndDelete({ _id: notificationId, user: userId });
  }
};
