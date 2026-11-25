import { Field } from "@api-decorators";
import { ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "HealthResponse returns a status of the app" })
export class HealthResponse {
  @Field({ description: "message is Ok if the service is up" })
  status: string;
}
