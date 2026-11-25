import { RequestContext } from "@context/request";
import { BaseMapper, BaseMapperInterfaceParameter } from "@plugin/mapper";
import { MapperUtility } from "@plugin/mapper/utilities/mapper.utility";
import { BasePluginServiceImpl } from "@plugin/service";

export abstract class BaseAdminPluginServiceImpl extends BasePluginServiceImpl {
  protected getMapper<T extends BaseMapper>(
    requestContext: RequestContext,
    mapperInterface: BaseMapperInterfaceParameter,
  ): T {
    return MapperUtility.getAdminMapper(mapperInterface, this.moduleRef);
  }
}
