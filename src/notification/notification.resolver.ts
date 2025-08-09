import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  Subscription,
} from '@nestjs/graphql';
import { Notification } from './notification.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guard/gql-auth.guard';
import { NotificationsService } from './notification.service';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(() => Notification)
export class NotificationsResolver {
  constructor(private notificationsService: NotificationsService) { }

  @Query(() => [Notification])
  @UseGuards(GqlAuthGuard)
  async myNotifications(@Context('user') user: { id: number }) {
    return this.notificationsService.getUserNotifications(String(user.id));
  }

  @Mutation(() => Notification)
  @UseGuards(GqlAuthGuard)
  async markNotificationRead(
    @Args('id') id: string,
    @Context('user') user: { id: number },
  ) {
    return this.notificationsService.markAsRead(id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async markAllNotificationsRead(
    @Context('user') user: { id: number },
  ): Promise<boolean> {
    await this.notificationsService.markAllAsRead(String(user.id));
    return true;
  }

  @Subscription(() => Notification, {
    filter: (payload, variables, context) => {
      return payload.userId === context.user.id;
    },
    resolve: (payload) => payload.notificationCreated,
  })
  @UseGuards(GqlAuthGuard)
  notificationCreated(@Context('user') user: { id: number }) {
    return pubSub.asyncIterableIterator('notificationCreated');
  }

  @Mutation(() => Notification)
  @UseGuards(GqlAuthGuard)
  async deleteNotification(
    @Args('id') id: string,
    @Context('user') user: { id: number },
  ) {
    return this.notificationsService.deleteNotification(id);
  }
}
