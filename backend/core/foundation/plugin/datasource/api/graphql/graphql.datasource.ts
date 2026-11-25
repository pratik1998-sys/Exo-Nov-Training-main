import { ModuleRef } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { PluginModuleData } from "@server/loader/types/loader.types";
import { StringUtility } from "@utilities";
import { RequestContext } from "@context/request";
import { Logger } from "@logger";
import { DatasourceRequiredFieldType } from "@plugin/datasource";
import {
  DatasourceServiceDefinition,
  BaseRestDatasource,
} from "@plugin-datasource-rest";
import { GraphQLDatasourceConfig } from "@plugin-datasource-graphql";
import { LoggerUtility } from "@logger/utilities";

export const GraphqlHttpMethods = {
  get: "get",
  post: "post",
};

export interface GraphqlDatasourceQuery {
  id?: string;
  queryId: string;
  query: string;
}

export interface GraphqlDatasourceQueries {
  [key: string]: GraphqlDatasourceQuery;
}

export interface GraphqlDatasourceServiceDefinition extends DatasourceServiceDefinition {
  query?: GraphqlDatasourceQuery;
}

export interface GraphqlDatasourceServiceDefinitions {
  [key: string]: GraphqlDatasourceServiceDefinition;
}

export abstract class BaseGraphqlDatasource extends BaseRestDatasource {
  protected serviceDefinitions: GraphqlDatasourceServiceDefinitions;

  protected queryCache: Record<string, GraphqlDatasourceQuery>;

  constructor(
    protected componentId,
    protected consumerIds: string[],
    protected plugin: PluginModuleData,
    protected moduleRef: ModuleRef,
    protected configService: ConfigService,
    protected logger: Logger,
  ) {
    super(componentId, consumerIds, plugin, moduleRef, configService, logger);

    this.queryCache = {};

    Object.values(this.serviceDefinitions).forEach(
      (serviceDefinition: GraphqlDatasourceServiceDefinition) => {
        if (serviceDefinition.query) {
          serviceDefinition.query.query = StringUtility.isStringNotEmpty(
            serviceDefinition.query.query,
          )
            ? this.prettifyQuery(serviceDefinition.query.query)
            : "";
        }
      },
    );
  }

  protected getRequiredConfigFields() {
    return {
      ...super.getRequiredConfigFields(),
      graphqlPath: DatasourceRequiredFieldType.string,
    };
  }

  protected async executeGQLService<T>(
    requestContext: RequestContext,
    serviceDefinition: GraphqlDatasourceServiceDefinition,
    variables: Record<string, any> = {},
    query: GraphqlDatasourceQuery = null,
    headers: any = {},
    maskedLogParams: string[] = [],
  ) {
    const methodname = `${BaseGraphqlDatasource.name}.executeGQLService`;

    let gqlResult: T;

    try {
      gqlResult = await this.executeGQL(
        requestContext,
        serviceDefinition,
        variables,
        query,
        headers,
        maskedLogParams,
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.info(
        `${methodname} - Error executing service [${serviceDefinition.id}] - [${this.logger.formatJSON(variables, maskedLogParams?.length > 0)}]: ${message}`,
        requestContext,
      );
      throw error;
    }

    return gqlResult;
  }

  protected async executeGQL<T>(
    requestContext: RequestContext,
    serviceDefinition: GraphqlDatasourceServiceDefinition,
    variables: Record<string, any> = {},
    query: GraphqlDatasourceQuery = null,
    headers: any = {},
    maskedLogParams: string[] = [],
    attempt: number = 1,
  ): Promise<T> {
    const methodname = `${BaseGraphqlDatasource.name}.executeGQL`;

    let body;
    let queryParams;

    query = query ?? serviceDefinition.query;

    if (GraphqlHttpMethods.get == serviceDefinition.method) {
      queryParams = {
        query: query?.query,
        variables: JSON.stringify(variables),
      };
    } else {
      body = {
        query: query?.query,
        variables,
      };
    }

    const logVariables = {
      ...variables,
    };

    //TODO: Handle nested params
    maskedLogParams.forEach((maskedParam) => {
      logVariables[maskedParam] = "*****";
    });

    const serviceId = this.buildServiceId(serviceDefinition);

    const isServiceLoggingEnabled =
      this.isServiceLoggingEnabled(serviceDefinition);

    const requestObj = this.composeRequest(
      requestContext,
      serviceDefinition,
      undefined,
      body,
      queryParams,
      headers,
    );

    const executorMethodName = isServiceLoggingEnabled
      ? `${BaseGraphqlDatasource.name}.execute [integration=${serviceId} host=${requestObj.baseURL} ${requestObj.method.toUpperCase()} queryId:${query.queryId} query:${query.query} variables:${this.applyLogMasks(logVariables)} headers:${JSON.stringify(requestObj.headers)}]`
      : null;

    const gqlResult = await this.doExecute(
      executorMethodName,
      requestContext,
      serviceId,
      serviceDefinition,
      requestObj,
      isServiceLoggingEnabled,
    );

    if (gqlResult?.errors) {
      this.logger.info(
        `${methodname} - GraphQL Errors: ${this.logger.formatJSON(gqlResult.errors)}`,
      );

      throw new Error(JSON.stringify(gqlResult.errors));
    }

    return gqlResult?.data;
  }

  protected composeRequest(
    requestContext: RequestContext,
    serviceDefinition: DatasourceServiceDefinition,
    paramMap: any,
    body: any,
    queryParams: any,
    headers: any,
  ) {
    const datasourceConfig = this.getDatasourceConfig<GraphQLDatasourceConfig>(
      requestContext,
      serviceDefinition.id,
    );

    const requestObj = {
      baseURL: this.getHost(
        requestContext,
        datasourceConfig,
        serviceDefinition,
      ),
      url: this.composePath(
        requestContext,
        datasourceConfig,
        serviceDefinition,
        paramMap,
      ),
      method: serviceDefinition.method,
      timeout: serviceDefinition.timeout
        ? serviceDefinition.timeout
        : BaseRestDatasource.defaultTimeout,
      headers: this.composeHeaders(
        requestContext,
        datasourceConfig,
        headers,
        serviceDefinition,
      ),
      auth: this.composeAuth(
        requestContext,
        datasourceConfig,
        serviceDefinition,
      ),
      data: body,
      params: this.composeQueryParams(
        requestContext,
        datasourceConfig,
        queryParams,
      ),
    };

    return requestObj;
  }

  protected composeURL(
    requestContext: RequestContext,
    datasourceConfig: GraphQLDatasourceConfig,
  ) {
    return datasourceConfig.graphqlPath;
  }

  protected composePath(
    requestContext: RequestContext,
    datasourceConfig: GraphQLDatasourceConfig,
    serviceDefinition: GraphqlDatasourceServiceDefinition,
    paramMap: Record<string, string>,
  ) {
    return datasourceConfig.graphqlPath;
  }

  protected setServiceDynamicQuery(
    serviceDefinition: GraphqlDatasourceServiceDefinition,
    queryDefinition: GraphqlDatasourceQuery,
  ) {
    serviceDefinition.query = queryDefinition;
    serviceDefinition.query.query = this.prettifyQuery(
      serviceDefinition.query.query,
    );
  }

  protected getQuery(
    serviceId: string,
    queryFn: () => GraphqlDatasourceQuery,
    cacheKey?: string,
  ): GraphqlDatasourceQuery {
    cacheKey = cacheKey ?? serviceId;

    let query: GraphqlDatasourceQuery = this.getQueryCacheEntry(cacheKey);

    if (query == null) {
      query = queryFn();

      this.setQueryCacheEntry(serviceId, query);
    }

    return query;
  }

  protected setQueryCacheEntry(
    cacheKey: string,
    queryDefinition: GraphqlDatasourceQuery,
  ) {
    queryDefinition.query = this.prettifyQuery(queryDefinition.query);

    this.queryCache[cacheKey] = queryDefinition;

    return this.queryCache[cacheKey];
  }

  protected getQueryCacheEntry(cacheKey: string): GraphqlDatasourceQuery {
    return this.queryCache[cacheKey] ?? null;
  }

  protected prettifyQuery(gqlQuery: string) {
    return gqlQuery.replace(/\s+/g, " ");
  }

  static prettifyQuery(gqlQuery: GraphqlDatasourceQuery) {
    return gqlQuery.query.replace(/\s+/g, " ");
  }
}
