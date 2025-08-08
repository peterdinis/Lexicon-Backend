import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { TemplatesService } from './templates.service';
import { Template, CreateTemplateInput } from './templates.types';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard'; 
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => Template)
export class TemplatesResolver {
  constructor(private templatesService: TemplatesService) {}

  @Query(() => [Template])
  getTemplates() {
    return this.templatesService.getAllTemplates();
  }

  @Query(() => Template)
  getTemplate(@Args('id') id: string) {
    return this.templatesService.getTemplateById(id);
  }

  @UseGuards(GqlAuthGuard) // protect mutation
  @Mutation(() => Template)
  async createCustomTemplate(
    @CurrentUser('id') userId: string,
    @Args('input') input: CreateTemplateInput,
  ) {
    return this.templatesService.createCustomTemplate(userId, input.title, input.blocks);
  }
}
