import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateUserInput } from 'src/users/dto/create-user-input';
import { LoginInput } from 'src/users/dto/login-input';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from './decorators/current-user.decorator';
import { GqlAuthGuard } from './guard/gql-auth.guard';
import { User } from 'src/users/users.model';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => String)
  async login(@Args('data') data: LoginInput): Promise<string> {
    const { accessToken } = await this.authService.login(data);
    return accessToken;
  }

  @Mutation(() => String)
  async register(@Args('data') data: CreateUserInput): Promise<string> {
    const { accessToken } = await this.authService.register(data);
    return accessToken;
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser() user: User) {
    return this.usersService.findByEmail(user.email);
  }
}
