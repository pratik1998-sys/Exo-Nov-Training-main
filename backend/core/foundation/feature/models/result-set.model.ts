import { Field } from "@api-decorators";
import { Pagination } from "@feature/models";
import { ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "Base result set" })
export class ResultSet<T = any> {
  @Field({ type: () => Pagination, description: "pagination" })
  pagination: Pagination;

  results?: T[];
}
