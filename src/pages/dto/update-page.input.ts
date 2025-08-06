import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsInt,
  MaxLength,
} from 'class-validator';

@InputType()
export class UpdatePageInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isDatabase?: boolean;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  parentPageId?: number;
}