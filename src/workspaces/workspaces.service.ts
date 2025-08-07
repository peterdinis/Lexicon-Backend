import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWorkspaceInput } from './dto/create-workspace-input';
import { UpdateWorkspaceInput } from './dto/update-workspace-input';

@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateWorkspaceInput) {
    // Optional: check if a workspace with same name exists
    const existing = await this.prisma.workspace.findFirst({
      where: { name: data.name },
    });
    if (existing) {
      throw new BadRequestException('Workspace name already exists');
    }

    return this.prisma.workspace.create({ data });
  }

  async findAll() {
    return this.prisma.workspace.findMany({
      include: { pages: true },
    });
  }

  async findOne(id: number) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
      include: { pages: true },
    });

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${id} not found`);
    }

    return workspace;
  }

  async update(id: number, data: UpdateWorkspaceInput) {
    const existing = await this.prisma.workspace.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException(`Workspace with ID ${id} not found`);
    }

    return this.prisma.workspace.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.workspace.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException(`Workspace with ID ${id} not found`);
    }

    return this.prisma.workspace.delete({
      where: { id },
    });
  }
}