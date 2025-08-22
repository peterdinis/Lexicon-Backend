import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Page {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  isDatabase: boolean;

  @Field(() => Int, { nullable: true })
  parentPageId?: number;

  @Field(() => Int)
  workspaceId: number;

  @Field(() => Int)
  ownerId: number;

  @Field(() => Int)
  sortPosition: number;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  emoji?: string;

  @Field()
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  trashedAt?: Date;

  @Field(() => [Page], { nullable: true })
  subPages?: Page[];
}
