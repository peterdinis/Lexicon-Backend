import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateNoteInput } from './dto/create-note.input';
import { UpdateNoteInput } from './dto/update-note.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateNoteInput) {
    if (!input.name?.trim()) {
      throw new BadRequestException('Note name is required');
    }

    // optional: ensure user exists before creating
    const userExists = await this.prisma.user.findUnique({
      where: { id: input.createdBy },
    });
    if (!userExists) {
      throw new BadRequestException(
        `User with id ${input.createdBy} does not exist`,
      );
    }

    return this.prisma.note.create({
      data: {
        name: input.name.trim(),
        description: input.description?.trim() || null,
        content: input.content,
        createdBy: input.createdBy,
      },
    });
  }

  async findAll() {
    return this.prisma.note.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        creator: true, // eager load user if needed
      },
    });
  }

  async findOne(id: string) {
    if (!id) {
      throw new BadRequestException('Note ID is required');
    }

    const note = await this.prisma.note.findUnique({
      where: { id },
      include: {
        creator: true,
      },
    });

    if (!note) {
      throw new NotFoundException(`Note with id "${id}" not found`);
    }
    return note;
  }

  async update(input: UpdateNoteInput) {
    if (!input.id) {
      throw new BadRequestException('Note ID is required for update');
    }

    const existing = await this.prisma.note.findUnique({
      where: { id: input.id },
    });
    if (!existing) {
      throw new NotFoundException(`Note with id "${input.id}" not found`);
    }

    const { id, ...data } = input;

    // Clean fields before updating
    if (data.name && !data.name.trim()) {
      throw new BadRequestException('Note name cannot be empty');
    }

    return this.prisma.note.update({
      where: { id },
      data: {
        ...data,
        name: data.name?.trim(),
        description: data.description?.trim(),
      },
    });
  }

  async remove(id: string) {
    if (!id) {
      throw new BadRequestException('Note ID is required for deletion');
    }

    const existing = await this.prisma.note.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Note with id "${id}" not found`);
    }

    return this.prisma.note.delete({ where: { id } });
  }
}
