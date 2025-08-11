import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PageCollaborator {
    @Field()
    userId: string;

    @Field()
    role: string;
}