import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  Min,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreatePageInput {
  @Field()
  @IsString()
  @MaxLength(255)
  title: string;

  @Field(() => Int)
  @IsInt()
  workspaceId: number;

  @Field(() => Int)
  @IsInt()
  ownerId: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  parentPageId?: number;

  @Field()
  @IsOptional()
  @IsString()
  emoji?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isDatabase?: boolean;
}
