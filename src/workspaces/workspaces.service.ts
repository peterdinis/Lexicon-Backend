import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WorkspaceQueryInput } from './dto/workspace-query.input';
import { CreateWorkspaceInput } from './dto/create-workspace-input';
import { UpdateWorkspaceInput } from './dto/update-workspace-input';

@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateWorkspaceInput) {
    const existing = await this.prisma.workspace.findFirst({
      where: { name: data.name },
    });
    if (existing) throw new Error('Workspace name already exists');

    return this.prisma.workspace.create({ data });
  }

  async findAll(query: WorkspaceQueryInput) {
    const { search, skip = 0, take = 10 } = query;

    const where = search
      ? {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      }
      : {};

    const [items, total] = await this.prisma.$transaction([
      this.prisma.workspace.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          pages: true,
        },
      }),
      this.prisma.workspace.count({ where }),
    ]);

    return { items, total };
  }

  async findOne(id: number) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
      include: { pages: true },
    });

    if (!workspace) throw new Error(`Workspace with ID ${id} not found`);
    return workspace;
  }

  async update(id: number, data: UpdateWorkspaceInput) {
    const existing = await this.prisma.workspace.findUnique({ where: { id } });
    if (!existing) throw new Error(`Workspace with ID ${id} not found`);

    return this.prisma.workspace.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.workspace.findUnique({ where: { id } });
    if (!existing) throw new Error(`Workspace with ID ${id} not found`);

    return this.prisma.workspace.delete({ where: { id } });
  }

  async switchWorkspace(userId: number, targetWorkspaceId: number) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: targetWorkspaceId },
    });

    if (!workspace) {
      throw new Error(`Workspace with ID ${targetWorkspaceId} not found`);
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { currentWorkspaceId: targetWorkspaceId },
    });

    return workspace;
  }
}
