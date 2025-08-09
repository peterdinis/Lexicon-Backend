import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { TemplatesService } from './templates.service';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/auth/guard/gql-auth.guard';
import {
  Template,
  CreateTemplateInput,
  UpdateTemplateInput,
} from './dto/templates.types';

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

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Template)
  async createCustomTemplate(
    @CurrentUser('id') userId: string,
    @Args('input') input: CreateTemplateInput,
  ) {
    return this.templatesService.createCustomTemplate(
      userId,
      input.title,
      input.blocks,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Template)
  async updateCustomTemplate(
    @CurrentUser('id') userId: string,
    @Args('input') input: UpdateTemplateInput,
  ) {
    return this.templatesService.updateCustomTemplate(
      userId,
      input.id,
      input.title,
      input.blocks,
    );
  }
}
