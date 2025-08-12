import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SearchService } from './search.service';
import { SearchResolver } from './search.resolver';

@Module({
  imports: [PrismaModule],
  providers: [SearchService, SearchResolver],
})
export class SearchModule {}
