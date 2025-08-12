import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PrismaService } from 'src/prisma/prisma.service';

const pubsub = new PubSub();
const DOCUMENT_UPDATED = 'DOCUMENT_UPDATED';

@Injectable()
export class PageCollaborationService {
  constructor(private readonly prismaService: PrismaService) {}

  async getPageById(id: number) {
    const page = await this.prismaService.page.findUnique({
      where: { id },
      include: {
        contents: true,
        properties: true,
        propertyValues: true,
        events: true,
        subPages: true,
      },
    });

    if (!page) {
      throw new NotFoundException(`Page with ID ${id} not found.`);
    }

    return page;
  }

  async documentCollaboration(
    userId: number,
    pageId: number,
    contents: { type: string; data: any; order: number }[],
  ) {
    // 1️⃣ Check if page exists & user has access
    const page = await this.prismaService.page.findUnique({
      where: { id: pageId },
      include: {
        collaborators: true,
        owner: true,
      },
    });

    if (!page) {
      throw new NotFoundException(`Page with ID ${pageId} not found.`);
    }

    const isOwner = page.ownerId === userId;
    const isCollaborator = page.collaborators.some(
      (c) => c.userId === userId && (c.role === 'EDITOR' || c.role === 'OWNER'),
    );

    if (!isOwner && !isCollaborator) {
      throw new BadRequestException(
        `You do not have permission to edit this page.`,
      );
    }

    const updatedPage = await this.prismaService.$transaction(async (tx) => {
      // Delete old contents
      await tx.content.deleteMany({ where: { pageId } });

      await tx.content.createMany({
        data: contents.map((c, index) => ({
          type: c.type as any,
          data: c.data,
          order: c.order ?? index,
          pageId,
        })),
      });

      await tx.pageHistory.create({
        data: {
          pageId,
          userId,
          change: JSON.stringify({ contents }),
        },
      });

      return tx.page.update({
        where: { id: pageId },
        data: { updatedAt: new Date() },
        include: { contents: true },
      });
    });

    pubsub.publish(DOCUMENT_UPDATED, {
      documentUpdated: {
        pageId,
        contents: updatedPage.contents,
        updatedAt: updatedPage.updatedAt,
        userId,
      },
    });

    return updatedPage;
  }

  async getPageHistory(
    pageId: number,
    page: number = 1,
    pageSize: number = 10,
  ) {
    await this.getPageById(pageId);

    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.pageHistory.findMany({
        where: { pageId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              lastName: true,
              photoUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prismaService.pageHistory.count({ where: { pageId } }),
    ]);

    const history = items.map((entry) => ({
      id: entry.id,
      userId: entry.userId,
      userName: `${entry.user.name ?? ''} ${entry.user.lastName ?? ''}`.trim(),
      userPhoto: entry.user.photoUrl,
      change: JSON.parse(entry.change),
      createdAt: entry.createdAt,
      createdAtFormatted: entry.createdAt.toLocaleString(),
    }));

    return {
      items: history,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
