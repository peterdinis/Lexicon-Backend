import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { Notification } from './notification.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guard/gql-auth.guard';
import { NotificationsService } from './notification.service';

@Resolver(() => Notification)
export class NotificationsResolver {
  constructor(private notificationsService: NotificationsService) {}

  @Query(() => [Notification])
  @UseGuards(GqlAuthGuard)
  async myNotifications(@Context('user') user) {
    return this.notificationsService.getUserNotifications(user.id);
  }

  @Mutation(() => Notification)
  @UseGuards(GqlAuthGuard)
  async markNotificationRead(
    @Args('id') id: string,
    @Context('user') user,
  ) {
    // optionally verify notification belongs to user
    return this.notificationsService.markAsRead(id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async markAllNotificationsRead(@Context('user') user): Promise<boolean> {
    await this.notificationsService.markAllAsRead(user.id);
    return true;
  }
}
