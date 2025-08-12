import { ObjectType, Field } from '@nestjs/graphql';
import { CalendarEvent } from 'src/calendar/calendar.model';
import { Page } from 'src/pages/pages.model';
import { Task } from 'src/tasks/tasks.model';
import { User } from 'src/users/users.model';
import { Workspace } from 'src/workspaces/workspace.model';

@ObjectType()
export class SearchResult {
  @Field(() => [User])
  users: User[];

  @Field(() => [Page])
  pages: Page[];

  @Field(() => [Workspace])
  workspaces: Workspace[];

  @Field(() => [Task])
  tasks: Task[];

  @Field(() => [CalendarEvent])
  events: CalendarEvent[];
}
