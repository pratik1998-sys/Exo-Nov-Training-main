export interface PaginationLimitOffset {
  limit: number;
  offset: number;
}

export interface PaginationCursor {
  first: number;
  after: string;
}
