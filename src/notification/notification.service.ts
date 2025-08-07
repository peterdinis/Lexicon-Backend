import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  private parseUserId(userId: string): number {
    const id = Number(userId);
    if (isNaN(id)) {
      throw new BadRequestException('Invalid userId: must be a number');
    }
    return id;
  }

  async createNotification(data: {
    userId: string; // prijímame string, ale konvertujeme
    type: string;
    title: string;
    description?: string;
  }){
    const userId = this.parseUserId(data.userId);
    return this.prisma.notification.create({
      data: {
        userId,
        type: data.type,
        title: data.title,
        description: data.description,
      },
    });
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
