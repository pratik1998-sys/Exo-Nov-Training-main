import { ConfigService } from "@nestjs/config";
import { OnModuleInit } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ModuleRef } from "@nestjs/core";
import { PluginModuleData } from "@server/loader/types/loader.types";
import { RequestContext } from "@context/request";
import { AxiosRequestConfig, ParamsSerializerOptions } from "axios";
import { PluginConsumerConfiguration } from "@configuration/types";
import { ConfigurationUtility } from "@configuration/utilities";
import { AppConfigurationKeys } from "@configuration/app";
import { Logger } from "@logger";
import {
  BaseDatasource,
  DatasourceRequiredFieldType,
} from "@plugin/datasource";
// Import directly to avoid circular dependency:
// rest.datasource -> @plugin/datasource/api (re-exports graphql) -> graphql.datasource -> rest.datasource
import { ApiDatasourceServiceLoggingRegistry } from "../api.datasource.logging.registry";
import { LoggerUtility } from "@logger/utilities";

// import { AxiosRequestConfig, ParamsSerializerOptions } from 'node_modules/axios/index.cjs';

export const HttpMethods = {
  get: "get",
  post: "post",
  put: "put",
  delete: "delete",
  patch: "patch",
};

export interface DatasourceServiceDefinitions {
  [key: string]: DatasourceServiceDefinition;
}

export interface DatasourceServiceDefinition {
  id: string;
  method: string;
  timeout?: number;

  //Not supported - yet
  cacheConfig?: {
    ttl: number;
  };

  retryConfig?: {
    maxAttempts: number;
    ignoreStatuses?: number[];
  };
  headers?: Record<string, string>;
  isNoAuthorization?: boolean;
}

export interface RestDatasourceServiceDefinition extends DatasourceServiceDefinition {
  path: string;
}

export interface RestDatasourceServiceDefinitions {
  [key: string]: RestDatasourceServiceDefinition;
}

/**
 * TODO - IMPLEMENT A CACHING MECHANISM FOR GET SERVICES
 */
export abstract class BaseRestDatasource
  extends BaseDatasource
  implements OnModuleInit
{
  // protected abstract getServiceDefinitions(): DatasourceServiceDefinitions;

  protected static readonly defaultTimeout = 5000;
  protected serviceDefinitions: DatasourceServiceDefinitions = {};
  protected readonly httpService: HttpService;

  constructor(
    protected componentId,
    protected consumerIds: string[],
    protected plugin: PluginModuleData,
    protected moduleRef: ModuleRef,
    protected configService: ConfigService,
    protected logger: Logger,
  ) {
    super(componentId, consumerIds, plugin, moduleRef, configService, logger);

    this.httpService = moduleRef.get(HttpService, { strict: false });
  }

  onModuleInit() {
    const serviceLoggingRegistry: ApiDatasourceServiceLoggingRegistry =
      ApiDatasourceServiceLoggingRegistry.getInstance();

    Object.values(this.serviceDefinitions).forEach((serviceDefinition) => {
      serviceLoggingRegistry.registerService(
        this.datasourceId,
        serviceDefinition as RestDatasourceServiceDefinition,
      );
    });

    this.resolveServiceOverrideConfigurations(
      Object.keys(this.serviceDefinitions),
    );
  }

  protected getRequiredConfigFields() {
    return {
      host: DatasourceRequiredFieldType.string,
    };
  }

  protected composeRequest(
    requestContext: RequestContext,
    serviceDefinition: RestDatasourceServiceDefinition,
    paramMap: Record<string, string>,
    body: any,
    queryParams: any,
    headers: any,
  ): AxiosRequestConfig {
    const datasourceConfig = this.getDatasourceConfig(
      requestContext,
      serviceDefinition.id,
    );

    const obj: AxiosRequestConfig = {
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
      data: HttpMethods.get != serviceDefinition.method ? body : undefined,
      params: this.composeQueryParams(
        requestContext,
        datasourceConfig,
        queryParams,
      ),
      paramsSerializer: this.composeParamsSerializer(
        requestContext,
        datasourceConfig,
      ),
    };

    return obj;
  }

  protected composeParamsSerializer(
    requestContext: RequestContext,
    datasourceConfig: any,
  ): ParamsSerializerOptions {
    return {
      indexes: null,
    };
  }

  protected getHost(
    requestContext: RequestContext,
    datasourceConfig: any,
    serviceDefinition: DatasourceServiceDefinition,
  ) {
    return datasourceConfig.host;
  }

  protected composeQueryParams(
    requestContext: RequestContext,
    dataSourceConfig: any,
    queryParams: any,
  ) {
    queryParams = queryParams ?? {};

    return queryParams;
  }

  protected composePath(
    requestContext: RequestContext,
    datasourceConfig: any,
    serviceDefinition: RestDatasourceServiceDefinition,
    paramMap: Record<string, string>,
  ) {
    let path = this.resolvePath(requestContext, serviceDefinition);

    Object.keys(paramMap).forEach((key) => {
      path = path.replaceAll(key, paramMap[key]);
    });

    return path;
  }

  protected resolvePath(
    requestContext: RequestContext,
    serviceDefinition: RestDatasourceServiceDefinition,
  ) {
    return serviceDefinition.path;
  }

  protected composeHeaders(
    requestContext: RequestContext,
    datasourceConfig: any,
    headers: Record<string, any>,
    serviceDefinition: DatasourceServiceDefinition,
  ) {
    headers = headers ?? {};

    const { configuration } =
      this.getPluginConsumerConfiguration<PluginConsumerConfiguration>(
        requestContext,
      );

    if (serviceDefinition.headers) {
      headers = {
        ...headers,
        ...serviceDefinition.headers,
      };
    }
    if (datasourceConfig.headers) {
      headers = {
        ...headers,
        ...datasourceConfig.headers,
      };
    }

    if (configuration.headers) {
      headers = {
        ...headers,
        ...configuration.headers,
      };
    }

    this.addAuthTokenToHeaders(
      requestContext,
      datasourceConfig,
      headers,
      serviceDefinition,
    );

    return headers;
  }

  //To be overridden by child datasources
  protected addAuthTokenToHeaders(
    requestContext: RequestContext,
    datasourceConfig: any,
    headers: Record<string, any>,
    serviceDefinition: DatasourceServiceDefinition,
  ) {
    return headers;
  }

  /**
   * This is for basic auth ONLY
   */
  protected composeAuth(
    requestContext: RequestContext,
    datasourceConfig: any,
    serviceDefinition: DatasourceServiceDefinition,
  ) {
    //const datasourceConfig = this.getDatasourceConfig(requestContext);

    const { username, password } = datasourceConfig;

    let basicAuth;

    if (username && password) {
      basicAuth = {
        username: username,
        password: password,
      };
    }

    return basicAuth;
  }

  protected buildServiceId(serviceDefinition: DatasourceServiceDefinition) {
    return `${this.datasourceId}:${serviceDefinition.id}`;
  }

  protected isServiceLoggingEnabled(
    serviceDefinition: DatasourceServiceDefinition,
  ) {
    const { id: pluginId, feature } = this.plugin;
    const { id: featureId } = feature;

    const serviceLoggingRegistry: ApiDatasourceServiceLoggingRegistry =
      ApiDatasourceServiceLoggingRegistry.getInstance();

    return serviceLoggingRegistry.isServiceLoggingEnabled(
      featureId,
      pluginId,
      serviceDefinition.id,
    );
  }

  protected applyLogMasks(
    obj: Record<string, any>,
    additionalMaskedFields: string[] = [],
  ) {
    return LoggerUtility.toStringWithMasks(
      obj,
      null,
      this.configService,
      additionalMaskedFields,
    );
  }

  protected async execute(
    requestContext: RequestContext,
    serviceDefinition: RestDatasourceServiceDefinition,
    queryParams: any = {},
    headers: any = {},
    paramMap: any = {},
    body: any = {},
    maskLogParams: string[] = [],
  ) {
    const methodname = `${BaseRestDatasource.name}.execute`;

    const serviceId = this.buildServiceId(serviceDefinition);

    const isServiceLoggingEnabled =
      this.isServiceLoggingEnabled(serviceDefinition);

    const requestObj = this.composeRequest(
      requestContext,
      serviceDefinition,
      paramMap,
      body,
      queryParams,
      headers,
    );

    const executorMethodName = isServiceLoggingEnabled
      ? `${BaseRestDatasource.name}.execute [integration=${serviceId} ${requestObj.method.toUpperCase()} host=${requestObj.baseURL} path=${this.resolvePath(requestContext, serviceDefinition)} params:${this.applyLogMasks(paramMap, maskLogParams)} query:${this.applyLogMasks(queryParams, maskLogParams)} url: ${requestObj.baseURL}/${requestObj.url} body:${this.applyLogMasks(body, maskLogParams)} headers:${this.applyLogMasks(requestObj.headers, maskLogParams)}]`
      : null;

    let result;

    try {
      result = await this.doExecute(
        executorMethodName,
        requestContext,
        serviceId,
        serviceDefinition,
        requestObj,
        isServiceLoggingEnabled,
      );
    } catch (error) {
      this.logger.info(
        `${methodname} - Error Executing [${serviceDefinition.id}] - (${this.logger.formatJSON(paramMap)}): ${error}`,
        requestContext,
      );
      throw error;
    }

    return result;
  }

  protected async doExecute(
    methodname: string,
    requestContext: RequestContext,
    serviceId: string,
    serviceDefinition: DatasourceServiceDefinition,
    requestObj: any,
    isServiceLoggingEnabled: boolean,
    attempt: number = 1,
  ) {
    let result;

    const isAccessLoggingEnabled = ConfigurationUtility.getBooleanValue(
      this.configService,
      AppConfigurationKeys.accessLogging,
    );

    let perfStart, perfEnd, error;

    if (isServiceLoggingEnabled || isAccessLoggingEnabled) {
      perfStart = new Date().getTime();
    }

    try {
      result = await this.httpService.axiosRef(requestObj);
    } catch (e: unknown) {
      const err = e as {
        message?: string;
        code?: string;
        response?: { data?: unknown };
      };
      if (err.message) {
        error = {
          status: 400,
          code: err.code,
          message: err.response?.data ?? err.message,
        };
      } else {
        error = err.response?.data;

        error.status = error.status ?? error.statusCode;
      }

      this.logger.info(
        `${methodname} - Error: ${this.logger.formatJSON(error)}`,
        requestContext,
      );
    }

    if (isServiceLoggingEnabled || isAccessLoggingEnabled) {
      perfEnd = new Date().getTime();

      const totalTime = perfEnd - perfStart;

      if (isServiceLoggingEnabled) {
        this.logger.info(
          `${methodname} - Execution time: ${totalTime}ms`,
          requestContext,
        );
      }

      if (isAccessLoggingEnabled) {
        if (!requestContext.integrations) {
          requestContext.integrations = [];
        }

        requestContext.integrations.push({ id: serviceId, time: totalTime });
      }
    }

    if (error != null) {
      const retryConfig = {
        maxAttempts: serviceDefinition.retryConfig?.maxAttempts
          ? serviceDefinition.retryConfig.maxAttempts
          : 1,
        ignoreStatuses: serviceDefinition.retryConfig?.ignoreStatuses
          ? serviceDefinition.retryConfig.ignoreStatuses
          : [],
      };

      if (
        attempt < retryConfig.maxAttempts &&
        !retryConfig.ignoreStatuses.includes(error.status)
      ) {
        attempt += 1;

        this.logger.info(
          `${methodname} - Retry attempt ${attempt} of ${retryConfig.maxAttempts}`,
          requestContext,
        );

        // TODO - AXIO MAY BE CACHING - INVESTIGATE DISABLING TO AVOID RETRYING WITH CACH
        result = await this.doExecute(
          methodname,
          requestContext,
          serviceId,
          serviceDefinition,
          requestObj,
          isServiceLoggingEnabled,
          attempt,
        );
      } else {
        this.logger.info(
          `${methodname} - Error: ${this.logger.formatJSON(error)}`,
          requestContext,
        );

        throw error;
      }
    } else if (isServiceLoggingEnabled) {
      this.logger.info(
        `${methodname} - Result: ${this.logger.formatJSON(result.data, true)}`,
        requestContext,
      );
    }

    return result?.data;
  }
}
