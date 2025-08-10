import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePageInput } from './dto/create-page.input';
import { UpdatePageInput } from './dto/update-page.input';
import { generateRandomToken } from 'src/shared/custom/genearteRandomToken';

@Injectable()
export class PagesService {
  constructor(private readonly prisma: PrismaService) { }

  async createPage(data: CreatePageInput) {
    const { title, workspaceId, ownerId, parentPageId, isDatabase } = data;

    await this.validateWorkspace(workspaceId);
    await this.validateOwner(ownerId);

    if (parentPageId) {
      await this.validateParentPage(parentPageId, workspaceId);
    }

    const duplicate = await this.prisma.page.findFirst({
      where: {
        title,
        workspaceId,
        parentPageId: parentPageId ?? null,
      },
    });
    if (duplicate) {
      throw new ConflictException(
        `A page with title "${title}" already exists in this section.`,
      );
    }

    const lastPage = await this.prisma.page.findFirst({
      where: { workspaceId, parentPageId },
      orderBy: { sortPosition: 'desc' },
    });

    const nextSortPosition = lastPage ? lastPage.sortPosition + 1 : 0;

    return this.prisma.page.create({
      data: {
        title,
        isDatabase: isDatabase ?? false,
        parentPageId,
        sortPosition: nextSortPosition,
        workspaceId,
        ownerId,
      },
    });
  }

  async getPageById(id: number) {
    const page = await this.prisma.page.findUnique({
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

  async getPages({
    workspaceId,
    parentPageId,
    search,
    page = 1,
    pageSize = 10,
    isDatabase,
  }: {
    workspaceId: number;
    parentPageId?: number;
    search?: string;
    isDatabase?: boolean;
    page?: number;
    pageSize?: number;
  }) {
    await this.validateWorkspace(workspaceId);

    const where = {
      workspaceId,
      parentPageId,
      ...(search && { title: { contains: search, mode: 'insensitive' } }),
      ...(isDatabase !== undefined && { isDatabase }),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.page.findMany({
        where,
        orderBy: { sortPosition: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.page.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async updatePage(id: number, data: UpdatePageInput) {
    const page = await this.getPageById(id);

    if (data.parentPageId && data.parentPageId === id) {
      throw new BadRequestException('A page cannot be its own parent.');
    }

    if (data.parentPageId) {
      const parent = await this.prisma.page.findUnique({
        where: { id: data.parentPageId },
      });
      if (!parent) throw new BadRequestException('Parent page not found.');
      if (parent.workspaceId !== page.workspaceId) {
        throw new BadRequestException(
          'Parent page must belong to the same workspace.',
        );
      }

      if (await this.checkCircularNesting(id, data.parentPageId)) {
        throw new BadRequestException('Circular nesting is not allowed.');
      }
    }

    return this.prisma.page.update({
      where: { id },
      data,
    });
  }

  async updateSortPosition(id: number, newPosition: number) {
    await this.getPageById(id);
    if (newPosition < 0)
      throw new BadRequestException('Sort position must be non-negative.');
    return this.prisma.page.update({
      where: { id },
      data: { sortPosition: newPosition },
    });
  }

  async deletePage(id: number) {
    await this.getPageById(id);
    return this.prisma.page.delete({ where: { id } });
  }

  async getPagesByOwner(ownerId: number) {
    await this.validateOwner(ownerId);
    return this.prisma.page.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSubPages(parentPageId: number) {
    await this.getPageById(parentPageId);
    return this.prisma.page.findMany({
      where: { parentPageId },
      orderBy: { sortPosition: 'asc' },
    });
  }

  private async validateWorkspace(workspaceId: number) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
    });
    if (!workspace) {
      throw new NotFoundException(
        `Workspace with ID ${workspaceId} not found.`,
      );
    }
  }

  private async validateOwner(ownerId: number) {
    const owner = await this.prisma.user.findUnique({ where: { id: ownerId } });
    if (!owner) {
      throw new NotFoundException(`User (owner) with ID ${ownerId} not found.`);
    }
  }

  private async validateParentPage(parentPageId: number, workspaceId: number) {
    const parent = await this.prisma.page.findUnique({
      where: { id: parentPageId },
    });
    if (!parent) {
      throw new BadRequestException(
        `Parent page with ID ${parentPageId} not found.`,
      );
    }
    if (parent.workspaceId !== workspaceId) {
      throw new BadRequestException(
        'Parent page must belong to the same workspace as the new page.',
      );
    }
  }

  private async checkCircularNesting(
    childId: number,
    parentId: number,
  ): Promise<boolean> {
    let currentId: number | null = parentId;

    while (currentId !== null) {
      if (currentId === childId) return true;

      const parent = await this.prisma.page.findUnique({
        where: { id: currentId },
        select: { parentPageId: true },
      });

      if (!parent) break;

      currentId = parent.parentPageId;
    }

    return false;
  }

  async moveToTrash(id: number) {
    const page = await this.getPageById(id);

    if (page.inTrash) {
      throw new BadRequestException('Page is already in the trash.');
    }

    return this.prisma.page.update({
      where: { id },
      data: {
        inTrash: true,
      },
    });
  }

  async restoreFromTrash(id: number) {
    const page = await this.getPageById(id);

    if (!page.inTrash) {
      throw new BadRequestException('Page is not in the trash.');
    }

    return this.prisma.page.update({
      where: { id },
      data: {
        inTrash: null,
      },
    });
  }

  async getTrashedPages(workspaceId: number, ownerId?: number) {
    await this.validateWorkspace(workspaceId);

    return this.prisma.page.findMany({
      where: {
        workspaceId,
        inTrash: { not: null },
        ...(ownerId && { ownerId }),
      },
      orderBy: { inTrash: 'desc' },
    });
  }

  async getPageTree(workspaceId: number, parentPageId: number | null = null) {
    const pages = await this.prisma.page.findMany({
      where: {
        workspaceId,
        parentPageId,
        inTrash: null,
      },
      orderBy: { sortPosition: 'asc' },
    });

    return Promise.all(
      pages.map(async (page) => {
        const children = await this.getPageTree(workspaceId, page.id);
        return { ...page, subPages: children };
      }),
    );
  }

  async publishPage(id: number) {
    const page = await this.getPageById(id);

    if (page.inPublished) {
      throw new BadRequestException('Page is already published.');
    }

    // Vytvorenie verejnej URL napríklad ako "http://yourdomain.com/public/{unikátnyToken}"
    // Tu môžeš použiť napríklad slug alebo generovať náhodný token
    const publicToken = generateRandomToken(); // implementuj funkciu alebo použij knižnicu ako nanoid

    const publicUrl = `http://yourdomain.com/public/${publicToken}`;

    return this.prisma.page.update({
      where: { id },
      data: {
        inPublished: true,
        publicUrl,
      },
    });
  }

  async unpublishPage(id: number) {
    const page = await this.getPageById(id);

    if (!page.inPublished) {
      throw new BadRequestException('Page is not published.');
    }

    return this.prisma.page.update({
      where: { id },
      data: { inPublished: false },
    });
  }
}
