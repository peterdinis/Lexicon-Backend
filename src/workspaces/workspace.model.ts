import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Page } from 'src/pages/pages.model';

@ObjectType()
export class Workspace {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [Page], { nullable: true })
  pages?: Page[];
}