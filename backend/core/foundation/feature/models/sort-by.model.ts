import { Field } from "@api-decorators";
import { InputType } from "@nestjs/graphql";

@InputType({ description: "Sort By" })
export class SortByInput {
  @Field({ description: "Sort by identifier" })
  identifier: string;

  @Field({ type: () => Boolean, description: "Sort ascending" })
  isAscending: boolean;
}
