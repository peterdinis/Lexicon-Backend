import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
export class Block {
  @Field()
  type: string;

  @Field()
  content: string;
}

@ObjectType()
export class Template {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field(() => [Block])
  blocks: Block[];

  @Field()
  isCustom: boolean;
}

@InputType()
export class CreateTemplateInput {
  @Field()
  title: string;

  @Field(() => [Block])
  blocks: Block[];
}

@InputType()
export class UpdateTemplateInput {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field(() => [Block])
  blocks: Block[];
}
