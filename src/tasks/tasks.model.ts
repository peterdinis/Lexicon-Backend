import { ObjectType, Field, Int } from '@nestjs/graphql';
import { TaskStatus } from '@prisma/client';

@ObjectType()
export class Task {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => TaskStatus)
  status: TaskStatus;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field({ nullable: true })
  completedAt?: Date;

  @Field(() => Int)
  pageId: number;

  @Field(() => Int, { nullable: true })
  assigneeId?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
