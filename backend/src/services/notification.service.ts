import { prisma } from '../config/prisma';
import { NotificationType } from '@prisma/client';

export const getNotifications = async (userId: string) => {
  return await prisma.notification.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
  });
};

export const markAsRead = async (userId: string, notificationId: string) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification || notification.user_id !== userId) {
    throw new Error('Notification not found');
  }

  return await prisma.notification.update({
    where: { id: notificationId },
    data: { is_read: true },
  });
};

export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: NotificationType = 'INFO'
) => {
  return await prisma.notification.create({
    data: {
      user_id: userId,
      title,
      message,
      type,
    },
  });
};
