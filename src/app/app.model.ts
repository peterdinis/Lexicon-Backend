import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AppModel {
  @Field()
  message: string;
}
