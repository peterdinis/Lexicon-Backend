import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserInput } from './dto/create-user-input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  async create(data: CreateUserInput & { password: string }) {
    if (!data.email || !this.validateEmail(data.email)) {
      throw new BadRequestException('Invalid email format.');
    }

    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }

    if (!data.password || data.password.length < 6) {
      throw new BadRequestException(
        'Password must be at least 6 characters long.',
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async login(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password.');
    }

    // Pokud používáš JWT, tady by se generoval token
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    if (users.length === 0) {
      throw new NotFoundException('No users found.');
    }
    return users;
  }

  async update(id: number, data: User) {
    // Validate if user exists first
    const user = await this.findById(id);

    if (data.email && !this.validateEmail(data.email)) {
      throw new BadRequestException('Invalid email format.');
    }

    if (data.email && data.email !== user.email) {
      const emailTaken = await this.findByEmail(data.email);
      if (emailTaken) {
        throw new BadRequestException('Email already in use.');
      }
    }

    if (data.password) {
      if (data.password.length < 6) {
        throw new BadRequestException(
          'Password must be at least 6 characters long.',
        );
      }
      // hash the new password before saving
      data.password = await bcrypt.hash(data.password, 10);
    }

    // Optionally, you can validate other fields like name, lastName, photoUrl here
    if (data.name && typeof data.name !== 'string') {
      throw new BadRequestException('Invalid name format.');
    }

    if (data.lastName && typeof data.lastName !== 'string') {
      throw new BadRequestException('Invalid lastName format.');
    }

    // Example of photoUrl validation (simple check)
    if (
      data.photoUrl &&
      !/^https?:\/\/.+\.(jpg|jpeg|png|gif|svg)$/.test(data.photoUrl)
    ) {
      throw new BadRequestException('Invalid photo URL.');
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
