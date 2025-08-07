import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Notification {
  @Field(() => ID)
  id: string;

  @Field(() => Number)
  userId: number;

  @Field()
  type: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description: string | null;

  @Field()
  isRead: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
