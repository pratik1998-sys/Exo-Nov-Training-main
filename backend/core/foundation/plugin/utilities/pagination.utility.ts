import { PaginationInput } from "@feature/models";

export interface PaginationLimitOffset {
  limit: number;
  offset: number;
}

export interface PaginationTakeSkip {
  take: number;
  skip: number;
}

export interface PaginationSizeCurrent {
  size: number;
  curent: number;
}

export class PaginationUtility {
  private static primePage(page: number) {
    return page ?? 1;
  }

  private static primePageSize(pageSize: number) {
    return pageSize ?? 100;
  }

  static transformPageToLimitOffset(
    page: number,
    pageSize: number,
  ): PaginationLimitOffset {
    page = this.primePage(page);
    pageSize = this.primePageSize(pageSize);

    return {
      limit: pageSize,
      offset: page > 1 ? (page - 1) * pageSize : 0,
    };
  }

  static transformPaginationToLimitOffset(
    paginationInput: PaginationInput,
  ): PaginationLimitOffset {
    return this.transformPageToLimitOffset(
      paginationInput?.page,
      paginationInput?.pageSize,
    );
  }

  static transformPageToSkipTake(
    page: number,
    pageSize: number,
  ): PaginationTakeSkip {
    const obj = this.transformPageToLimitOffset(page, pageSize);

    return {
      take: obj.limit,
      skip: obj.offset,
    };
  }

  static transformPaginationToSkipTake(
    paginationInput: PaginationInput,
  ): PaginationTakeSkip {
    return this.transformPageToSkipTake(
      paginationInput?.page,
      paginationInput?.pageSize,
    );
  }
}
