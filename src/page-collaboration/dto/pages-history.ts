import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class PageHistory {
  @Field()
  id: string;

  @Field(() => Int)
  userId: number;

  @Field()
  userName: string;

  @Field({ nullable: true })
  userPhoto?: string;

  @Field(() => String)
  change: string;

  @Field()
  createdAt: Date;

  @Field()
  createdAtFormatted: string;
}