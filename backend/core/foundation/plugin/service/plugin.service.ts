import { PluginConsumerConfiguration } from "@configuration/types";
import { RequestContext } from "@context/request";
import { FeatureErrors } from "@feature/error";
import { PaginationInput, ResultSet } from "@feature/models";
import { OnModuleInit } from "@nestjs/common";
import { getDataSourceToken, getRepositoryToken } from "@nestjs/typeorm";
import { BasePluginComponent } from "@plugin/base/plugin.component";
import {
  getPluginDatabaseConnection,
  resolvePluginPrimaryDatabaseId,
} from "@plugin/database";
import {
  BaseDatasource,
  BaseDatasourceInterfaceParameter,
} from "@plugin/datasource";
import { BaseMapper, BaseMapperInterfaceParameter } from "@plugin/mapper";
import { MapperUtility } from "@plugin/mapper/utilities/mapper.utility";
import { PaginationCursor, PaginationLimitOffset } from "@plugin/types";
import { DataSource } from "typeorm";

export abstract class BasePluginServiceImpl
  extends BasePluginComponent
  implements OnModuleInit
{
  protected mapper: any;

  protected consumerMappers: Record<string, any> = {};

  protected getDatasource<T extends BaseDatasource>(
    requestContext: RequestContext,
    datasourceInterface?: BaseDatasourceInterfaceParameter,
  ): T {
    throw new Error(
      `Datasource for ${this.plugin.id}.${this.plugin.feature.id} is not implemented. Inherit from DatasourcePluginServiceImpl instead`,
    );
  }

  /**
   * Returns the TypeORM repository for the given entity, resolved against a database
   * connection. Available on every plugin service impl - REST, GraphQL, or
   * database-backed - as a plugin may need database access in addition to (or instead
   * of) a datasource.
   *
   * Connection resolution order: the explicit `databaseId` argument (for a one-off
   * query against a non-default connection), then the entity's own
   * `@PluginDatabaseConnection` decorator, then the plugin's primary database
   * connection (the `databases` entry flagged `primary: true`, or the first entry).
   * Throws if the plugin has no `databases` configured, or if the entity is not
   * registered for the resolved connection.
   */
  protected getRepository<T>(repositoryClass: any, databaseId?: string): T {
    const resolvedDatabaseId =
      databaseId ??
      getPluginDatabaseConnection(repositoryClass) ??
      resolvePluginPrimaryDatabaseId(this.plugin.configuration);

    const token = getRepositoryToken(repositoryClass, resolvedDatabaseId);

    return this.moduleRef.get(token, { strict: false });
  }

  /**
   * Returns the underlying TypeORM `DataSource` for a database connection. Useful for
   * multi-entity transactions, raw queries, or a `QueryRunner` - anything beyond a
   * single entity's `Repository`.
   *
   * Pass `databaseId` to target a specific connection (required when the plugin has
   * more than one and the query is not tied to a single decorated entity); otherwise
   * resolves to the plugin's primary database connection.
   */
  protected getDatabaseConnection(databaseId?: string): DataSource {
    const resolvedDatabaseId =
      databaseId ?? resolvePluginPrimaryDatabaseId(this.plugin.configuration);

    const token = getDataSourceToken(resolvedDatabaseId);
    return this.moduleRef.get(token, { strict: false });
  }

  protected getMapper<T extends BaseMapper>(
    requestContext: RequestContext,
    mapperInterface?: BaseMapperInterfaceParameter,
  ): T {
    const consumerId = this.getConsumerId(requestContext);

    if (mapperInterface) {
      return MapperUtility.getMapper(
        consumerId,
        mapperInterface,
        this.moduleRef,
        this.logger,
      );
    } else {
      return this.consumerMappers[consumerId];
    }
  }

  protected translateLimitOffsetPagination(
    requestContext: RequestContext,
    paginationInput: PaginationInput,
    defaultLimit: number = 100,
  ): PaginationLimitOffset {
    const { configuration } =
      this.getPluginConsumerConfiguration<PluginConsumerConfiguration>(
        requestContext,
      );

    const limit =
      paginationInput?.pageSize ??
      configuration?.pagination?.pageSize?.default ??
      defaultLimit;

    const pagination: PaginationLimitOffset = {
      limit: limit,
      offset: paginationInput?.page ? (paginationInput.page - 1) * limit : 0,
    };

    return pagination;
  }

  protected translateCursorPagination(
    paginationInput: PaginationInput,
    defaultLimit: number = 100,
  ): PaginationCursor {
    const limit = paginationInput?.pageSize ?? defaultLimit;

    const pagination: PaginationCursor = {
      first: limit,
      after: paginationInput.cursor,
    };

    return pagination;
  }

  protected validatePagination(
    paginationInput: PaginationInput,
    requestContext: RequestContext,
    disableMaxPagination?: boolean,
  ) {
    paginationInput = paginationInput ?? {};

    const { configuration } =
      this.getPluginConsumerConfiguration<PluginConsumerConfiguration>(
        requestContext,
      );

    const { pagination } = configuration;

    if (pagination?.pageSize) {
      if (!paginationInput.pageSize && pagination.pageSize.default) {
        paginationInput.pageSize = pagination.pageSize.default;
      } else if (
        !disableMaxPagination &&
        pagination.pageSize.max &&
        paginationInput.pageSize > pagination.pageSize.max
      ) {
        throw FeatureErrors.paginationMaxSizeExceeded();
      }
    }

    return paginationInput;
  }

  protected composeResultSetWithPagination<T extends ResultSet>(
    paginationInput: PaginationInput,
    resultList: NonNullable<T["results"]>,
    requestContext: RequestContext,
  ): T {
    const limitOffsetPagination = this.translateLimitOffsetPagination(
      requestContext,
      paginationInput,
    );

    const resultCount = resultList.length;

    const { limit, offset } = limitOffsetPagination;

    const totalPages =
      limit > 0
        ? resultCount < limit
          ? 1
          : Math.ceil(resultCount / limit)
        : 0;
    const pageNumber = limit > 0 ? Math.floor(offset / limit) + 1 : 1;

    return {
      pagination: {
        page: pageNumber,
        pageSize: limit,
        resultCount: resultCount,
        pageCount: totalPages,
        hasMorePages: pageNumber < totalPages,
      },
      results: resultList.slice(offset, offset + limit),
    } as T;
  }

  protected getConsumerId(requestContext: RequestContext) {
    return requestContext.consumer;
  }

  getTokenId(requestContext: RequestContext): string {
    return this.getPluginTokenId(requestContext);
  }

  onModuleInit() {
    const methodname = `${BasePluginServiceImpl.name}.onModuleInit`;

    for (const consumerId of this.consumerIds) {
      try {
        this.consumerMappers[consumerId] =
          MapperUtility.getMapperByConsumerAndFeature(
            consumerId,
            this.plugin.feature.id,
            this.moduleRef,
            this.logger,
          );
      } catch (error) {
        this.logger.info(
          `${methodname} - Error fetching mapper for consumerId ${consumerId}, featureId: ${this.plugin.feature.id}: ${error}`,
        );
      }
    }
  }
}
