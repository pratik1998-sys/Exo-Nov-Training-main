import { StringUtility } from "@utilities";
import { RequestContext } from "@context/request";
import { BaseFeatureComponent } from "@feature/base/feature.component";
import {
  BaseFeatureService,
  BaseFeatureServiceParameter,
} from "@feature/service";
import {
  ResultSetQuery,
  SearchableResultSetQuery,
  SearchableSortableResultSetQuery,
} from "@feature/controller/models";
import { ResultSetQueryType } from "@feature/controller/types";
import { SortByInput } from "@feature/models";
import { DateRangeInput, PaginationInput } from "@feature/models";

export abstract class BaseFeatureController extends BaseFeatureComponent {
  protected resolveService<T extends BaseFeatureService>(
    requestContext: RequestContext,
    serviceInterface: BaseFeatureServiceParameter,
    isAdminService: boolean = false,
  ): T {
    return super.resolveService<T>(
      requestContext,
      serviceInterface,
      isAdminService,
    );
  }

  protected getRequestContext(request: any): RequestContext {
    return request?.raw?.requestContext ? request.raw.requestContext : {};
  }

  protected processResultSetQuery(
    query: ResultSetQuery &
      SearchableResultSetQuery &
      SearchableSortableResultSetQuery,
  ): ResultSetQueryType {
    let q: ResultSetQueryType = {};

    if (query) {
      q.pagination = {
        page: query?.page,
        pageSize: query?.pageSize,
      };

      // q.term = query.term;

      if (query.sortBy) {
        const arr = query.sortBy.split(":");

        q.sortBy = {
          identifier: arr[0],
          isAscending: arr.length > 0 ? arr[1].toUpperCase() == "ASC" : false,
        };
      }

      q.term = query.term;

      return q;
    }
  }

  protected composePaginationInput(
    page: number,
    pageSize: number,
  ): PaginationInput {
    return {
      page,
      pageSize,
    };
  }

  protected composeSortByInput(sortBy: string): SortByInput {
    let sortByInput: SortByInput;

    if (StringUtility.isStringNotEmpty(sortBy)) {
      const arr = sortBy.split(":");

      sortByInput = {
        identifier: arr[0],
        isAscending: arr.length == 2 && arr[1].toUpperCase() == "ASC",
      };
    }

    return sortByInput;
  }

  protected composeInputList(listStr: string) {
    let list: string[];

    if (StringUtility.isStringNotEmpty(listStr)) {
      list = listStr.split(",");
    }

    return list;
  }

  /**
   * When query parameter is defined as type[] (ie string[]) and only one item is sent in the query param field, the NestJS
   * framework appears to make this an individual "value" and not array of values. This method will ensure the expected array
   * type
   *
   * @param value
   * @returns
   */
  protected validateInputListField(value: any) {
    return value && !Array.isArray(value) ? [value] : value;
  }

  protected composeDateRangeInput(
    startOn: string,
    endOn: string,
  ): DateRangeInput {
    const hasStartOn = StringUtility.isStringNotEmpty(startOn);
    const hasEndOn = StringUtility.isStringNotEmpty(endOn);

    let dateRangeInput: DateRangeInput;

    if (hasStartOn || hasEndOn) {
      dateRangeInput = {
        from: startOn,
        to: endOn,
      };
    }

    return dateRangeInput;
  }

  protected addItemIdentifierToResultSetQuery(
    identifiersStr: string,
    identifierList: string[],
  ) {
    if (StringUtility.isStringNotEmpty(identifiersStr)) {
      identifiersStr.split(",").forEach((identifier) => {
        identifierList.push(identifier);
      });
    }
  }
}
