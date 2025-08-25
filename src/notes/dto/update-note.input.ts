import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreateNoteInput } from './create-note.input';
import { GraphQLJSON } from 'graphql-type-json';

@InputType()
export class UpdateNoteInput extends PartialType(CreateNoteInput) {
  @Field(() => ID)
  id: string;

  @Field(() => GraphQLJSON, { nullable: true })
  content?: any;
}