import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesResolver } from './templates.resolver';

@Module({
  providers: [TemplatesService, TemplatesResolver],
})
export class TemplatesModule {}