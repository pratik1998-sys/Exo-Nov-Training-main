import { Field, FieldType } from "@api-decorators";

const { integer } = FieldType;

export class ResultSetQuery {
  @Field({ description: "Result Set Current Page", required: false }, integer)
  page?: number;

  @Field({ description: "Result Set Page Size", required: false }, integer)
  pageSize?: number;
}

export class SortableResultSetQuery extends ResultSetQuery {
  @Field({ description: "Result Set Sort By", required: false })
  sortBy?: string;
}

export class SearchableResultSetQuery extends ResultSetQuery {
  @Field({ description: "Result Set Search Term", required: false })
  term?: string;
}

export class SearchableSortableResultSetQuery extends SortableResultSetQuery {
  @Field({ description: "Result Set Search Term", required: false })
  term?: string;
}
