import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PagesService } from './pages.service';
import { PagesResolver } from './pages.resolver';

@Module({
  imports: [PrismaModule],
  providers: [PagesService, PagesResolver],
})
export class PagesModule {}
