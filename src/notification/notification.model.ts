import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Notification {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  type: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  isRead: boolean;

  @Field()
  createdAt: Date;
}
