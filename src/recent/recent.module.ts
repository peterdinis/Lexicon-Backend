import { Module } from '@nestjs/common';
import { PUB_SUB, pubSub } from './recent.provider';
import { RecentResolver } from './recent.resolver';

@Module({
  providers: [
    {
      provide: PUB_SUB,
      useValue: pubSub,
    },
    RecentResolver
  ],
  exports: [PUB_SUB],
})
export class RecentModule {}