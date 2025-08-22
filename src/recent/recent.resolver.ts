import { Resolver, Subscription } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { CalendarEvent } from 'src/calendar/calendar.model';
import { Page } from 'src/pages/pages.model';
import { Workspace } from 'src/workspaces/workspace.model';
import { PUB_SUB } from './recent.provider';
import { Notification } from 'src/notification/notification.model';

export interface Events {
  pageCreated: Page;
  workspaceCreated: Workspace;
  eventCreated: CalendarEvent;
  notificationCreated: Notification;
  [event: string]: unknown;
}

export const pubSub = new PubSub<Events>();

@Resolver()
export class RecentResolver {
  constructor(@Inject(PUB_SUB) private pubSub: any) {}

  @Subscription(() => Page, { name: 'pageCreated' })
  pageCreated() {
    return this.pubSub.asyncIterator('pageCreated');
  }

  @Subscription(() => Workspace, { name: 'workspaceCreated' })
  workspaceCreated() {
    return this.pubSub.asyncIterator('workspaceCreated');
  }

  @Subscription(() => CalendarEvent, { name: 'eventCreated' })
  eventCreated() {
    return this.pubSub.asyncIterator('eventCreated');
  }

  @Subscription(() => Notification, { name: 'notificationCreated' })
  notificationCreated() {
    return this.pubSub.asyncIterator('notificationCreated');
  }
}