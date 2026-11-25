import { RequestParameters } from "@api-parameters";
import {
  applyDecorators,
  Controller as NestController,
  ControllerOptions as NestControllerOptions,
  Delete as NestDelete,
  Get as NestGet,
  PipeTransform,
  Post as NestPost,
  Put as NestPut,
  Type as NestType,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import {
  Args as NestArgs,
  ArgsOptions as NestArgsOptions,
  Mutation as NestMutation,
  MutationOptions as NestMutationOptions,
  Query as NestQuery,
  QueryOptions as NestQueryOptions,
  Resolver as NestResolver,
  ResolverOptions as NestResolverOptions,
  ResolverTypeFn as NestResolverTypeFn,
  ReturnTypeFunc as NestReturnTypeFunc,
} from "@nestjs/graphql";
import {
  ApiBody as NestApiBody,
  ApiBodyOptions as NestApiBodyOptions,
  ApiOkResponse as NestApiOkResponse,
  ApiOperation as NestApiOperation,
  ApiParam as NestApiParam,
  ApiParamOptions as NestApiParamOptions,
  ApiQuery as NestApiQuery,
  ApiQueryOptions as NestApiQueryOptions,
  ApiResponseNoStatusOptions as NestApiResponseNoStatusOptions,
  ApiTags as NestApiTags,
} from "@nestjs/swagger";
import { FeatureModuleData } from "@server/loader/types/loader.types";
import { StringUtility } from "@utilities";

export interface Parameter {
  id: string;
  description: string;
}

export type ParameterBaseOptions = {
  parameter: Parameter;
};

export interface ApiOptions {
  id?: string;
  feature?: FeatureModuleData;
}

export type ApiQueryOptions = ParameterBaseOptions & NestApiQueryOptions;

export type ApiParamOptions = {
  name?: string;
} & ParameterBaseOptions &
  Omit<NestApiParamOptions, "name">;

export type ArgsOptions = {
  required?: boolean;
} & ParameterBaseOptions &
  NestArgsOptions;

export interface ApiOperationBaseOptions {
  name: string;
  id?: string;
  isAuthRequired?: boolean;
  suppressAPIAccessControl?: boolean;
  scope?: string[];
}

export interface GraphQLOperationOptions extends ApiOperationBaseOptions {
  required?: boolean;
}

export interface RestAPIOptions extends ApiOperationBaseOptions {
  summary?: string;
  description?: string;
  path?: string | string[];
  apiOkResponseOptions: NestApiResponseNoStatusOptions;
  idPathParameter?: Parameter;
  pathParameters?: Parameter[];
  apiParamOptions?: ApiParamOptions[];
  apiQueryOptions?: ApiQueryOptions[];
  tags?: string | string[];
}

export interface RestPostPutAPIOptions extends RestAPIOptions {
  apiBodyOptions: NestApiBodyOptions;
}

export interface RestGetAPIOptions extends RestAPIOptions {
  isById?: boolean;
  doPagination?: boolean;
  doSort?: boolean;
  doSearchTerm?: boolean;
}

export type ResolverOptions = ApiOptions & NestResolverOptions;
export type QueryOptions = NestQueryOptions & GraphQLOperationOptions;
export type MutationOptions = NestMutationOptions & GraphQLOperationOptions;

export type ControllerOptions = {
  tags: string | string[];
} & ApiOptions &
  NestControllerOptions;

export const Api = Reflector.createDecorator<ApiOptions>();
export const ApiOperation = Reflector.createDecorator<
  GraphQLOperationOptions | RestAPIOptions
>();

export function ApiQuery(options: ApiQueryOptions) {
  const {
    parameter: { id, description },
  } = options;

  return applyDecorators(NestApiQuery({ name: id, description, ...options }));
}

export function ApiParam(options: ApiParamOptions) {
  const {
    parameter: { id, description },
  } = options;

  return applyDecorators(NestApiParam({ name: id, description, ...options }));
}

/**
 * doPagination and doSort should be true for result set queries that the query is not defined
 * in a child of ResultSetQuery (which has these fields already)
 *
 * @param options
 * @returns
 */
export function ApiResultSetQueryParameters(options: RestGetAPIOptions) {
  const { doPagination, doSort, doSearchTerm } = options;

  const decorators: Array<
    MethodDecorator | ClassDecorator | PropertyDecorator
  > = [];

  if (doPagination) {
    decorators.push(
      ApiQuery({
        parameter: RequestParameters.pageSize,
        type: Number,
        required: false,
      }),
    );
    decorators.push(
      ApiQuery({
        parameter: RequestParameters.page,
        type: Number,
        required: false,
      }),
    );
  }

  if (doSort) {
    decorators.push(
      ApiQuery({
        parameter: RequestParameters.sortBy,
        type: Number,
        required: false,
      }),
    );
  }

  if (doSearchTerm) {
    decorators.push(
      ApiQuery({ parameter: RequestParameters.term, required: false }),
    );
  }

  return applyDecorators(...decorators);
}

export function Resolver(
  typeFunc: NestResolverTypeFn | Function,
  options: ResolverOptions,
) {
  return applyDecorators(
    NestResolver(typeFunc, options),
    composeApiDecorator(options),
  );
}

export function Args(
  options: ArgsOptions,
  ...pipes: (NestType<PipeTransform> | PipeTransform)[]
) {
  const {
    parameter: { id, description },
  } = options;

  options.name = id;
  options.description = description;

  processGraphQLNullable(options);

  return NestArgs(options, ...pipes);
}

export function Query(
  typeFunction: NestReturnTypeFunc,
  options: QueryOptions,
  feature?: FeatureModuleData,
) {
  options = options ?? {
    name: null,
    required: false,
    description: null,
    isAuthRequired: false,
    suppressAPIAccessControl: false,
    scope: [],
  };

  processGraphQLNullable(options);

  return applyDecorators(
    NestQuery(typeFunction, options),
    composeApiOperationDecorator(options),
  );
}

export function Mutation(
  typeFunction: NestReturnTypeFunc,
  options: MutationOptions,
  feature?: FeatureModuleData,
) {
  options = options ?? {
    name: null,
    required: false,
    description: null,
    isAuthRequired: false,
    suppressAPIAccessControl: false,
    scope: [],
  };

  processGraphQLNullable(options);

  return applyDecorators(
    NestMutation(typeFunction, options),
    composeApiOperationDecorator(options),
  );
}

export function Controller(options: ControllerOptions) {
  const { tags } = options;

  const decorators: Array<
    MethodDecorator | ClassDecorator | PropertyDecorator
  > = [NestController(options), composeApiDecorator(options)];

  const tagsDecorator = composeApiTagsDecorator(tags);

  if (tagsDecorator) {
    decorators.push(tagsDecorator);
  }

  return applyDecorators(...decorators);
}

export function Get(options: RestGetAPIOptions, feature?: FeatureModuleData) {
  const { isById } = options;

  if (isById) {
    resolvePath(options);
  }

  const decorators: Array<
    MethodDecorator | ClassDecorator | PropertyDecorator
  > = [NestGet(options.path)];

  if (!isById) {
    decorators.push(ApiResultSetQueryParameters(options));
  } else {
    decorators.push(composeIdPathParamDecorator(options));
  }

  return applyApiDecorators(decorators, options, feature);
}

export function Post(
  options: RestPostPutAPIOptions,
  feature?: FeatureModuleData,
) {
  return applyApiDecorators([NestPost(options.path)], options, feature);
}

export function Put(
  options: RestPostPutAPIOptions,
  feature?: FeatureModuleData,
) {
  resolvePath(options);

  return applyApiDecorators(
    [NestPut(options.path), composeIdPathParamDecorator(options)],
    options,
    feature,
  );
}

export function Delete(options: RestAPIOptions, feature?: FeatureModuleData) {
  resolvePath(options);

  return applyApiDecorators(
    [NestDelete(options.path), composeIdPathParamDecorator(options)],
    options,
    feature,
  );
}

const resolvePath = (options: RestAPIOptions) => {
  const { path } = options;

  if (!path) {
    const idPathParameter = resolveByIdPathParameter(options);

    options.path = `:${idPathParameter.id}`;
  }
};

const composeIdPathParamDecorator = (options: RestAPIOptions) => {
  const idPathParameter = resolveByIdPathParameter(options);

  return ApiParam({ parameter: idPathParameter, required: true });
};

const resolveByIdPathParameter = (options: RestGetAPIOptions) => {
  return options.idPathParameter ?? RequestParameters.id;
};

const composeApiOperationDecorator = (
  options: GraphQLOperationOptions | RestAPIOptions,
) => {
  options.id = options.id ?? options.name;

  return ApiOperation(options);
};

const composeApiDecorator = (options: ApiOptions) => {
  options.id = options.id ?? options.feature?.id;

  return Api(options);
};

const composeApiTagsDecorator = (tags: string | string[]) => {
  let apiTagsDecorator: MethodDecorator & ClassDecorator;

  if (tags) {
    if (Array.isArray(tags)) {
      apiTagsDecorator = NestApiTags(...tags);
    } else {
      apiTagsDecorator = NestApiTags(tags);
    }
  }

  return apiTagsDecorator;
};

const processGraphQLNullable = (
  options: QueryOptions | MutationOptions | ArgsOptions,
) => {
  options.nullable = options.required ? false : (options.nullable ?? true);
};

const applyApiDecorators = (
  decorators: Array<MethodDecorator | ClassDecorator | PropertyDecorator>,
  options: Partial<RestGetAPIOptions & RestPostPutAPIOptions>,
  feature?: FeatureModuleData,
) => {
  const { apiOkResponseOptions, apiParamOptions, apiQueryOptions, tags } =
    options;

  decorators.push(composeApiOperationDecorator(options as RestAPIOptions));

  const { description, summary } = getOperationDescriptionSummary(
    options,
    feature,
  );

  if (
    StringUtility.isStringNotEmpty(summary) ||
    StringUtility.isStringNotEmpty(description)
  ) {
    decorators.push(NestApiOperation({ summary, description }));
  }

  if (apiOkResponseOptions) {
    decorators.push(NestApiOkResponse(apiOkResponseOptions));
  }

  if (options.apiBodyOptions) {
    decorators.push(NestApiBody(options.apiBodyOptions));
  }

  if (apiParamOptions) {
    apiParamOptions.forEach((paramOption) =>
      decorators.push(ApiParam(paramOption)),
    );
  }

  if (apiQueryOptions) {
    apiQueryOptions.forEach((queryOption) =>
      decorators.push(ApiQuery(queryOption)),
    );
  }

  const tagsDecorator = composeApiTagsDecorator(tags);

  if (tagsDecorator) {
    decorators.push(tagsDecorator);
  }

  return applyDecorators(...decorators);
};

const getOperationDescriptionSummary = (
  options: Partial<RestGetAPIOptions & RestPostPutAPIOptions>,
  feature?: FeatureModuleData,
) => {
  let { description, summary } = options;

  const operationConfiguration = feature?.configuration?.operations?.find(
    (operation) => operation.id === options.id,
  );

  description = operationConfiguration?.description ?? description;
  summary = operationConfiguration?.summary ?? summary;

  return { description, summary };
};
