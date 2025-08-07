import { InputType, Field } from '@nestjs/graphql';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsInt,
} from 'class-validator';
import { TaskStatus } from 'generated/prisma';

@InputType()
export class CreateTaskInput {
  @Field()
  @IsString()
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => TaskStatus, { defaultValue: TaskStatus.todo })
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @Field(() => Number)
  @IsInt()
  pageId: number;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsInt()
  assigneeId?: number;
}
