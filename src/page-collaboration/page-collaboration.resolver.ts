import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PageHistory } from './dto/pages-history';
import { PageCollaborationService } from './page-collaboration.service';
import { Page } from 'src/pages/pages.model';

@Resolver()
export class PageCollaborationResolver {
  constructor(
    private readonly pageCollaborationService: PageCollaborationService,
  ) {}

  @Query(() => [PageHistory])
  async getPageHistory(
    @Args('pageId', { type: () => Int }) pageId: number,
    @Args('page', { type: () => Int, nullable: true }) pageNumber?: number,
    @Args('pageSize', { type: () => Int, nullable: true }) pageSize?: number,
  ) {
    return this.pageCollaborationService.getPageHistory(
      pageId,
      pageNumber ?? 1,
      pageSize ?? 10,
    );
  }

  @Mutation(() => Page)
  async collaborateOnPage(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('pageId', { type: () => Int }) pageId: number,
    @Args('contents', { type: () => [String] }) contents: string[],
  ) {
    const parsedContents = contents.map((c) => JSON.parse(c));
    return this.pageCollaborationService.documentCollaboration(
      userId,
      pageId,
      parsedContents,
    );
  }
}
