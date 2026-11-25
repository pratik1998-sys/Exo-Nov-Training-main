import { RequestContext } from "@context/request";
import { Pagination } from "@feature/models";
import { BasePluginComponent } from "@plugin/base/plugin.component";
import { MapperLoggingRegistry } from "@plugin/mapper";
import { MapperUtility } from "@plugin/mapper/utilities/mapper.utility";
import { PaginationLimitOffset } from "@plugin/types";

export type BaseMapperInterfaceParameter = {
  id: string;
};

export abstract class BaseMapper extends BasePluginComponent {
  protected logTransformation(
    methodname: string,
    requestContext: RequestContext,
    mapperId: string,
    input: any,
    output: any,
  ) {
    const mapperLoggingRegistry: MapperLoggingRegistry =
      MapperLoggingRegistry.getInstance();

    if (
      mapperLoggingRegistry.isMapperLoggingEnabled(
        this.plugin.feature.id,
        this.plugin.id,
        mapperId,
      )
    ) {
      this.logger.info(
        `${methodname} - Mapped Input: ${this.logger.formatJSON(input)} - Output: ${this.logger.formatJSON(output)}`,
        requestContext,
      );
    }
  }

  /**
   * Returns a map of mappers, one entry per consumerId in the application, with the associated mapper class instance
   * @param mapperInterface
   * @returns
   *
   * @deprecated
   */
  protected loadExternalFeatureMapper<T extends BaseMapper>(
    mapperInterface: BaseMapperInterfaceParameter,
  ): Record<string, T> {
    const methodname = `${BaseMapper.name}.loadExternalFeatureMapper`;

    const mappers: Record<string, T> = {};

    this.consumerIds.forEach((consumerId) => {
      mappers[consumerId] = MapperUtility.getMapper(
        consumerId,
        mapperInterface,
        this.moduleRef,
        this.logger,
      );
    });

    return mappers;
  }

  protected mapLimitOffsetPagination(
    requestContext: RequestContext,
    limitOffset: PaginationLimitOffset,
    totalCount: number,
  ): Pagination {
    const { limit, offset } = limitOffset;

    const totalPages = totalCount < limit ? 1 : Math.ceil(totalCount / limit);
    const pageNumber = Math.ceil(offset / limit) + 1;

    const obj: Pagination = {
      page: pageNumber,
      pageSize: limit,
      resultCount: totalCount,
      pageCount: totalPages,
      hasMorePages: pageNumber < totalPages,
    };

    return obj;
  }
}
