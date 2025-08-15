import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesResolver } from './templates.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TemplatesService, TemplatesResolver],
})
export class TemplatesModule {}
