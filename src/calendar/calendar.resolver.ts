import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CalendarService } from './calendar.service';
import { CalendarEvent } from './calendar.model';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';

@Resolver(() => CalendarEvent)
export class CalendarResolver {
  constructor(private readonly calendarService: CalendarService) {}

  @Mutation(() => CalendarEvent)
  createEvent(@Args('input') input: CreateEventInput) {
    return this.calendarService.create(input);
  }

  @Query(() => [CalendarEvent])
  events(
    @Args('userId', { type: () => Int, nullable: true }) userId?: number,
    @Args('pageId', { type: () => Int, nullable: true }) pageId?: number,
  ) {
    return this.calendarService.findAll(userId, pageId);
  }

  @Query(() => CalendarEvent)
  event(@Args('id', { type: () => Int }) id: number) {
    return this.calendarService.findOne(id);
  }

  @Mutation(() => CalendarEvent)
  updateEvent(@Args('input') input: UpdateEventInput) {
    return this.calendarService.update(input.id, input);
  }

  @Mutation(() => CalendarEvent)
  deleteEvent(@Args('id', { type: () => Int }) id: number) {
    return this.calendarService.remove(id);
  }
}
