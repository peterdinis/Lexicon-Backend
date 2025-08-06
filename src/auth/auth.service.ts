import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserInput } from 'src/users/dto/create-user-input';
import { LoginInput } from 'src/users/dto/login-input';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(input: CreateUserInput) {
    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = await this.usersService.create({
      ...input,
      password: hashedPassword,
    });
    return this.signUser(user.id, user.email);
  }

  async login(input: LoginInput) {
    const user = await this.usersService.findByEmail(input.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await bcrypt.compare(input.password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    return this.signUser(user.id, user.email);
  }

  private signUser(userId: number, email: string) {
    const payload = { sub: userId, email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
