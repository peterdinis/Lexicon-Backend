import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class CalendarEvent {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  start: Date;

  @Field()
  end: Date;

  @Field(() => Int)
  pageId: number;

  @Field(() => Int)
  userId: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}