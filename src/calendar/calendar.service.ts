import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async create(input: CreateEventInput) {
    this.validateDate(input.start, input.end);
    this.validateTitle(input.title);

    await this.ensureUserExists(input.userId);
    await this.ensurePageExists(input.pageId);

    return this.prisma.calendarEvent.create({ data: input });
  }

  async findAll(userId?: number, pageId?: number) {
    return this.prisma.calendarEvent.findMany({
      where: {
        ...(userId && { userId }),
        ...(pageId && { pageId }),
      },
      orderBy: { start: 'asc' },
    });
  }

  async findOne(id: number) {
    const event = await this.prisma.calendarEvent.findUnique({ where: { id } });
    if (!event) throw new NotFoundException(`Event with ID ${id} not found`);
    return event;
  }

  async update(id: number, input: UpdateEventInput) {
    const existing = await this.findOne(id);

    if (input.start && input.end) {
      this.validateDate(input.start, input.end);
    }

    if (input.title !== undefined) {
      this.validateTitle(input.title);
    }

    if (input.userId) {
      await this.ensureUserExists(input.userId);
    }

    if (input.pageId) {
      await this.ensurePageExists(input.pageId);
    }

    return this.prisma.calendarEvent.update({
      where: { id },
      data: input,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.calendarEvent.delete({ where: { id } });
  }

  // --- 🔒 Validation Helpers ---

  private validateDate(start: Date, end: Date) {
    if (new Date(start) >= new Date(end)) {
      throw new BadRequestException(`Start date must be before end date`);
    }
  }

  private validateTitle(title: string) {
    if (!title || !title.trim()) {
      throw new BadRequestException('Title cannot be empty');
    }
  }

  private async ensureUserExists(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);
  }

  private async ensurePageExists(pageId: number) {
    const page = await this.prisma.page.findUnique({ where: { id: pageId } });
    if (!page) throw new NotFoundException(`Page ${pageId} not found`);
  }
}
