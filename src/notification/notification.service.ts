import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PubSub } from 'graphql-subscriptions';
import { Notification } from './notification.model';

interface NotificationEvents {
  [eventName: string]: unknown;
  notificationCreated: {
    notificationCreated: Notification;
    userId: number;
  };
}

@Injectable()
export class NotificationsService {
  private pubSub = new PubSub<NotificationEvents>();

  constructor(private prisma: PrismaService) {}

  getPubSub() {
    return this.pubSub;
  }

  private parseUserId(userId: string): number {
    const id = Number(userId);
    if (isNaN(id)) {
      throw new BadRequestException('Invalid userId: must be a number');
    }
    return id;
  }

  async createNotification(data: {
    userId: string;
    type: string;
    title: string;
    description: string;
  }) {
    const userId = this.parseUserId(data.userId);

    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type: data.type,
        title: data.title,
        description: data.description!,
      },
    });

    // Publish the new notification event
    this.pubSub.publish('notificationCreated', {
      notificationCreated: notification,
      userId,
    });

    return notification;
  }

  async getUserNotifications(userId: string) {
    const id = this.parseUserId(userId);
    return this.prisma.notification.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(notificationId: string) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string): Promise<number> {
    const id = this.parseUserId(userId);
    const result = await this.prisma.notification.updateMany({
      where: { userId: id, isRead: false },
      data: { isRead: true },
    });
    return result.count;
  }
}
