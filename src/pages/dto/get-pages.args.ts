import { ArgsType, Field, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  IsBoolean,
} from 'class-validator';

@ArgsType()
export class GetPagesArgs {
  @Field(() => Int)
  @IsInt()
  workspaceId: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  parentPageId?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isDatabase?: boolean;

  @Field(() => Int, { defaultValue: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @Field(() => Int, { defaultValue: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize?: number = 10;
}
