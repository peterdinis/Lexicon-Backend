import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: string) {
    const q = query.trim();

    if (!q) {
      return {
        users: [],
        pages: [],
        workspaces: [],
        tasks: [],
        events: [],
      };
    }

    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: q } },
          { name: { contains: q } },
          { lastName: { contains: q } },
        ],
      },
      take: 10,
    });

    const pages = await this.prisma.page.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { emoji: { contains: q } },
          // můžeš přidat další pole, pokud chceš
        ],
      },
      take: 10,
    });

    const workspaces = await this.prisma.workspace.findMany({
      where: {
        name: { contains: q },
      },
      take: 10,
    });

    const tasks = await this.prisma.task.findMany({
      where: {
        OR: [{ title: { contains: q } }, { description: { contains: q } }],
      },
      take: 10,
    });

    const events = await this.prisma.calendarEvent.findMany({
      where: {
        title: { contains: q },
      },
      take: 10,
    });

    return { users, pages, workspaces, tasks, events };
  }
}
