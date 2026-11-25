import {
  ApiOperationBaseOptions,
  MutationOptions,
  QueryOptions,
  RestAPIOptions,
  RestGetAPIOptions,
  RestPostPutAPIOptions,
} from "@api-decorators";

export interface ApiOperationOptions extends Omit<
  ApiOperationBaseOptions,
  "name"
> {
  name?: string;
  queryOptions?: QueryOptions;
  mutationOptions?: MutationOptions;
  restOptions?: RestAPIOptions & RestPostPutAPIOptions;
}

export type ApiOperationRestOptions = Omit<
  RestGetAPIOptions & RestPostPutAPIOptions,
  "description" | "summary"
>;
export type ApiOperationQueryOptions = Omit<QueryOptions, "description">;
export type ApiOperationMutationOptions = Omit<MutationOptions, "description">;

export type ApiOperationDefinition = {
  id: string;
  name?: string;
  description?: string;
  summary?: string;
  isAuthRequired?: boolean;
  suppressAPIAccessControl?: boolean;
  scope?: string[];
  restOptions?: Partial<ApiOperationRestOptions>;
  queryOptions?: Partial<ApiOperationQueryOptions>;
  mutationOptions?: Partial<ApiOperationMutationOptions>;
};

export type ApiOperationDefinitions = {
  [key: string]: ApiOperationDefinition;
};

export class ApiConfiguration {
  protected static composeOperationOptionsBase(
    operation: ApiOperationDefinition,
    operationOptions:
      | Partial<ApiOperationRestOptions>
      | Partial<ApiOperationQueryOptions>
      | Partial<ApiOperationMutationOptions>,
    operationName?: string,
  ): Partial<QueryOptions | MutationOptions | RestAPIOptions> {
    return {
      ...operation,
      ...operationOptions,
      name: operationName ?? operation.name,
    };
  }

  protected static composeOperationOptions(
    operation: ApiOperationDefinition,
    operationName?: string,
  ): ApiOperationOptions {
    const operationOptions: ApiOperationOptions = {};

    if (operation.restOptions) {
      operationOptions.restOptions = {
        ...(this.composeOperationOptionsBase(
          operation,
          operation.restOptions,
          operationName,
        ) as RestAPIOptions),
        apiBodyOptions: operation.restOptions.apiBodyOptions ?? null,
      };
    }

    if (operation.queryOptions) {
      operationOptions.queryOptions = {
        ...(this.composeOperationOptionsBase(
          operation,
          operation.restOptions,
          operationName,
        ) as QueryOptions),
        nullable:
          operation.queryOptions.nullable ?? !operation.queryOptions.required,
      };
    }

    if (operation.mutationOptions) {
      operationOptions.mutationOptions = {
        ...(this.composeOperationOptionsBase(
          operation,
          operation.restOptions,
          operationName,
        ) as MutationOptions),
        nullable:
          operation.mutationOptions.nullable ??
          !operation.mutationOptions.required,
      };
    }

    return operationOptions;
  }
}
