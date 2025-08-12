import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UserResult {
  @Field() id: number;
  @Field() email: string;
  @Field({ nullable: true }) name?: string;
  @Field({ nullable: true }) lastName?: string;
}

@ObjectType()
export class PageResult {
  @Field() id: number;
  @Field() title: string;
  @Field({ nullable: true }) emoji?: string;
}

@ObjectType()
export class WorkspaceResult {
  @Field() id: number;
  @Field() name: string;
}

@ObjectType()
export class TaskResult {
  @Field() id: number;
  @Field() title: string;
  @Field({ nullable: true }) description?: string;
}

@ObjectType()
export class EventResult {
  @Field() id: number;
  @Field() title: string;
}
