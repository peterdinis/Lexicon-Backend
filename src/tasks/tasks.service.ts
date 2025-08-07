import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTaskInput) {
    // Validate page exists
    const page = await this.prisma.page.findUnique({
      where: { id: data.pageId },
    });
    if (!page) {
      throw new NotFoundException(`Page with ID ${data.pageId} not found.`);
    }

    // Validate assignee exists if provided
    if (data.assigneeId) {
      const user = await this.prisma.user.findUnique({
        where: { id: data.assigneeId },
      });
      if (!user) {
        throw new NotFoundException(
          `User with ID ${data.assigneeId} not found.`,
        );
      }
    }

    // Optional: Check due date is in future
    if (data.dueDate && new Date(data.dueDate) < new Date()) {
      throw new BadRequestException('Due date must be in the future.');
    }

    return this.prisma.task.create({ data });
  }

  async findAll() {
    return this.prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        page: true,
        assignee: true,
      },
    });
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        page: true,
        assignee: true,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }

    return task;
  }

  async update(id: number, data: UpdateTaskInput) {
    // Ensure task exists
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }

    // Optional: Validate new pageId
    if (data.pageId && data.pageId !== existing.pageId) {
      const page = await this.prisma.page.findUnique({
        where: { id: data.pageId },
      });
      if (!page) {
        throw new NotFoundException(`Page with ID ${data.pageId} not found.`);
      }
    }

    // Optional: Validate new assignee
    if (data.assigneeId && data.assigneeId !== existing.assigneeId) {
      const user = await this.prisma.user.findUnique({
        where: { id: data.assigneeId },
      });
      if (!user) {
        throw new NotFoundException(
          `User with ID ${data.assigneeId} not found.`,
        );
      }
    }

    return this.prisma.task.update({ where: { id }, data });
  }

  async remove(id: number) {
    // Ensure task exists
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }

    return this.prisma.task.delete({ where: { id } });
  }
}
