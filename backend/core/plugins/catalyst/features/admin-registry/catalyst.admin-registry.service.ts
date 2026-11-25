import { AdminRegistryService } from "@admin-features/registry";
import { RequestContext } from "@context/request";
import { MessengerLoggingRegistry } from "@messenger";
import { ApiDatasourceServiceLoggingRegistry } from "@plugin/datasource/api";
import { MapperLoggingRegistry } from "@plugin/mapper";
import { BaseAdminPluginServiceImpl } from "@plugin/service";
import { RegistryUtility } from "@registry/utilities/registry.utility";

export class AdminRegistryServiceImpl
  extends BaseAdminPluginServiceImpl
  implements AdminRegistryService
{
  protected readonly ignoreRegistryConsumers: string[] = [
    ApiDatasourceServiceLoggingRegistry.registryId,
    MapperLoggingRegistry.registryId,
    MessengerLoggingRegistry.registryId,
  ];

  async getRegistries(requestContext: RequestContext, context?: any) {
    return RegistryUtility.getRegistryIds(this.moduleRef, this.logger);
  }

  /**
   * Most registries are consumer-generic, meaning, they are used for all consumers. However, the NestJS
   * moduleRef has providers for each consumer (sharing the same instance), and the token has the consumerId
   * prefixed. Thus, if a registry id is sent in that is not prefixed with a valid consumerId (this is probably
   * a majority of the time), prepend with the defaultConsumerId of the application, to obtain the registry
   * isntance.
   *
   * @param id
   * @returns
   */
  async getRegistryData(
    id: string,
    requestContext: RequestContext,
    context?: any,
  ) {
    const methodname = `${AdminRegistryService.name}.getRegistry`;

    id = this.resolveRegistryId(id);

    const registry = RegistryUtility.getRegistryById(
      id,
      this.moduleRef,
      this.logger,
    );

    const data = registry.getRegistryData();

    this.logger.info(
      `${methodname} - Registry ${id}, Data: ${this.logger.formatJSON(data)}`,
    );

    return data;
  }

  async refreshRegistry(
    id: string,
    requestContext: RequestContext,
    context?: any,
  ) {
    const methodname = `${AdminRegistryService.name}.refreshRegistry`;

    id = this.resolveRegistryId(id);

    const registry = RegistryUtility.getRegistryById(
      id,
      this.moduleRef,
      this.logger,
    );

    await registry.refresh();

    const data = registry.getRegistryData();

    return data;
  }

  protected resolveRegistryId(id: string) {
    if (!this.ignoreRegistryConsumers.includes(id)) {
      const arr = id.split(".");

      if (!this.appConsumerIds.includes(arr[0])) {
        id = `${this.defaultConsumerId}.${id}`;
      }
    }

    return id;
  }
}
