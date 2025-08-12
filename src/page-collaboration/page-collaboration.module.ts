import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PageCollaborationService } from './page-collaboration.service';
import { PageCollaborationResolver } from './page-collaboration.resolver';

@Module({
  imports: [PrismaModule],
  providers: [PageCollaborationService, PageCollaborationResolver],
})
export class PageCollaborationModule {}
