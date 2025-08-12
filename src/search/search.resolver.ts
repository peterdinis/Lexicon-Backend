import { Resolver, Query, Args, Field, ObjectType } from '@nestjs/graphql';
import { SearchService } from './search.service';
import {
  UserResult,
  PageResult,
  WorkspaceResult,
  TaskResult,
  EventResult,
} from './dto/search-result';

@ObjectType()
class SearchResult {
  @Field(() => [UserResult]) users: UserResult[];
  @Field(() => [PageResult]) pages: PageResult[];
  @Field(() => [WorkspaceResult]) workspaces: WorkspaceResult[];
  @Field(() => [TaskResult]) tasks: TaskResult[];
  @Field(() => [EventResult]) events: EventResult[];
}

@Resolver()
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => SearchResult, { name: 'search' })
  async search(@Args('query') query: string) {
    return this.searchService.search(query);
  }
}
