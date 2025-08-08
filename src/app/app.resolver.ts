import { Resolver, Query } from '@nestjs/graphql';
import { AppModel } from './app.model';

@Resolver(() => AppModel)
export class AppModelResolver {
  @Query(() => [AppModel])
  getHelloWorldList(): AppModel[] {
    return [
      { message: 'Hello World' },
      { message: 'Hello World' },
      { message: 'Hello World' },
    ];
  }
}