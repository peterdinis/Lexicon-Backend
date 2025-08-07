import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateWorkspaceInput {
  @Field()
  @IsNotEmpty()
  name: string;
}