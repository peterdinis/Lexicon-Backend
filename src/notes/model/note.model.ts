import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@ObjectType()
export class Note {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => GraphQLJSON)
  content: any;

  @Field()
  createdBy: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
