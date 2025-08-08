import { Resolver, Query, Args } from '@nestjs/graphql';
import { TemplatesService } from './templates.service';
import { Template } from './templates.types';

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
}