import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Workspace } from '../workspace.model';

@ObjectType()
export class WorkspacePaginated {
  @Field(() => [Workspace])
  items: Workspace[];

  @Field(() => Int)
  total: number;
}