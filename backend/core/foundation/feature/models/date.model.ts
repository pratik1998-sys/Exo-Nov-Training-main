import { Field } from "@api-decorators";
import { InputType } from "@nestjs/graphql";

@InputType({ description: "Date range input" })
export class DateRangeInput {
  @Field({ description: "date start" })
  from?: string;

  @Field({ description: "date end" })
  to?: string;
}
