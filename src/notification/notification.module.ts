import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationsService } from './notification.service';
import { NotificationsResolver } from './notification.resolver';

@Module({
  imports: [PrismaModule],
  providers: [NotificationsService, NotificationsResolver],
})
export class NotificationModule {}
