import { Field, FieldType } from "@api-decorators";
import { ObjectType } from "@nestjs/graphql";

const { json } = FieldType;

@ObjectType()
export class AdminRegistryModel {
  @Field({ description: "data" }, json)
  data: object;
}
