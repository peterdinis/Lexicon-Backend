import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class UserResult {
  @Field(() => ID) id: string;
  @Field() name: string;
  @Field() email: string;
}

@ObjectType()
export class PageResult {
  @Field(() => ID) id: string;
  @Field() title: string;
}

@ObjectType()
export class WorkspaceResult {
  @Field(() => ID) id: string;
  @Field() name: string;
}

@ObjectType()
export class TaskResult {
  @Field(() => ID) id: string;
  @Field() title: string;

  // make sure this matches your Prisma model
  @Field({ nullable: true }) status?: string;
}

@ObjectType()
export class EventResult {
  @Field(() => ID) id: string;
  @Field() title: string;

  // make sure this matches your Prisma model
  @Field({ nullable: true }) date?: Date;
}