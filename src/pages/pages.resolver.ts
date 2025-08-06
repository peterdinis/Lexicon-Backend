import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
} from '@nestjs/graphql';
import { PagesService } from './pages.service';
import { CreatePageInput } from './dto/create-page.input';
import { UpdatePageInput } from './dto/update-page.input';
import { GetPagesArgs } from './dto/get-pages.args';
import { Page } from './pages.model';

@Resolver(() => Page)
export class PagesResolver {
  constructor(private readonly pagesService: PagesService) {}

  // CREATE
  @Mutation(() => Page)
  createPage(@Args('input') input: CreatePageInput) {
    return this.pagesService.createPage(input);
  }

  // GET BY ID
  @Query(() => Page)
  getPage(@Args('id', { type: () => Int }) id: number) {
    return this.pagesService.getPageById(id);
  }

  // GET MULTIPLE (with filters + pagination)
  @Query(() => [Page])
  getPages(@Args() args: GetPagesArgs) {
    return this.pagesService.getPages(args);
  }

  // UPDATE
  @Mutation(() => Page)
  updatePage(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdatePageInput,
  ) {
    return this.pagesService.updatePage(id, input);
  }

  // UPDATE SORT POSITION
  @Mutation(() => Page)
  updatePageSortPosition(
    @Args('id', { type: () => Int }) id: number,
    @Args('sortPosition', { type: () => Int }) sortPosition: number,
  ) {
    return this.pagesService.updateSortPosition(id, sortPosition);
  }

  // DELETE
  @Mutation(() => Page)
  deletePage(@Args('id', { type: () => Int }) id: number) {
    return this.pagesService.deletePage(id);
  }

  // SUBPAGES
  @Query(() => [Page])
  getSubPages(@Args('parentPageId', { type: () => Int }) parentPageId: number) {
    return this.pagesService.getSubPages(parentPageId);
  }
}