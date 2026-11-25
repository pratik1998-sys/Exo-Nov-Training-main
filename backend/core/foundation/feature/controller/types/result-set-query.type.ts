import { PaginationInput, SortByInput } from "@feature/models";

export interface ResultSetQueryType {
  term?: string;
  pagination?: PaginationInput;
  sortBy?: SortByInput;
}
