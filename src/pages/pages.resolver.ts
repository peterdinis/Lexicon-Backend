import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PagesService } from './pages.service';
import { CreatePageInput } from './dto/create-page.input';
import { UpdatePageInput } from './dto/update-page.input';
import { GetPagesArgs } from './dto/get-pages.args';
import { Page } from './pages.model';

@Resolver(() => Page)
export class PagesResolver {
  constructor(private readonly pagesService: PagesService) {}

  @Mutation(() => Page)
  createPage(@Args('input') input: CreatePageInput) {
    return this.pagesService.createPage(input);
  }

  @Query(() => Page)
  getPage(@Args('id', { type: () => Int }) id: number) {
    return this.pagesService.getPageById(id);
  }

  @Query(() => [Page])
  getPages(@Args() args: GetPagesArgs) {
    return this.pagesService.getPages(args);
  }

  @Mutation(() => Page)
  updatePage(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdatePageInput,
  ) {
    return this.pagesService.updatePage(id, input);
  }

  @Mutation(() => Page)
  updatePageSortPosition(
    @Args('id', { type: () => Int }) id: number,
    @Args('sortPosition', { type: () => Int }) sortPosition: number,
  ) {
    return this.pagesService.updateSortPosition(id, sortPosition);
  }

  @Mutation(() => Page)
  deletePage(@Args('id', { type: () => Int }) id: number) {
    return this.pagesService.deletePage(id);
  }

  @Query(() => [Page])
  getSubPages(@Args('parentPageId', { type: () => Int }) parentPageId: number) {
    return this.pagesService.getSubPages(parentPageId);
  }

  @Mutation(() => Page)
  async movePageToTrash(@Args('id', { type: () => Int }) id: number) {
    return this.pagesService.moveToTrash(id);
  }

  @Mutation(() => Page)
  async restorePageFromTrash(@Args('id', { type: () => Int }) id: number) {
    return this.pagesService.restoreFromTrash(id);
  }

  @Query(() => [Page])
  async trashedPages(
    @Args('workspaceId', { type: () => Int }) workspaceId: number,
    @Args('ownerId', { type: () => Int, nullable: true }) ownerId?: number,
  ) {
    return this.pagesService.getTrashedPages(workspaceId, ownerId);
  }

  @Query(() => Page)
  async page(@Args('id', { type: () => Int }) id: number) {
    return this.pagesService.getPageById(id);
  }

  @Query(() => [Page])
  async pageTree(
    @Args('workspaceId', { type: () => Int }) workspaceId: number,
    @Args('parentPageId', { type: () => Int, nullable: true })
    parentPageId?: number,
  ) {
    return this.pagesService.getPageTree(workspaceId, parentPageId ?? null);
  }

  @Mutation(() => Page)
  async movePage(
    @Args('id', { type: () => Int }) id: number,
    @Args('newParentId', { type: () => Int, nullable: true })
    newParentId?: number,
  ) {
    return this.pagesService.updatePage(id, {
      parentPageId: newParentId ?? undefined,
    });
  }

  @Mutation(() => Page)
  publishPage(@Args('id', { type: () => Int }) id: number) {
    return this.pagesService.publishPage(id);
  }

  @Mutation(() => Page)
  unpublishPage(@Args('id', { type: () => Int }) id: number) {
    return this.pagesService.unpublishPage(id);
  }
}
