import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateEventInput {
  @Field()
  title: string;

  @Field()
  start: Date;

  @Field()
  end: Date;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  pageId: number;
}
