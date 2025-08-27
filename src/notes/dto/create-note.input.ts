import { InputType, Field } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@InputType()
export class CreateNoteInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => GraphQLJSON)
  content: any;

  @Field()
  createdBy: number;
}