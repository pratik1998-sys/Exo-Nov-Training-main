import { Field, FieldType } from "@api-decorators";
import { ObjectType, InputType } from "@nestjs/graphql";

const { integer } = FieldType;

@InputType()
export class PaginationInput {
  @Field({ description: "page to retrieve" }, integer)
  page?: number;

  @Field({ description: "pagination cursor" })
  cursor?: string;

  @Field(
    {
      description: "result count per page",
    },
    integer,
  )
  pageSize?: number;
}

@ObjectType({ description: "Pagination" })
export class Pagination {
  @Field({ description: "current page" }, integer)
  page: number;

  @Field({ description: "result count per page" }, integer)
  pageSize: number;

  @Field({ description: "total number of pages" }, integer)
  pageCount: number;

  @Field({ description: "total results" }, integer)
  resultCount: number;

  @Field({ type: () => Boolean, description: "more pages exist" })
  hasMorePages: boolean;

  @Field({ description: "next cursor" })
  cursor?: string;
}
