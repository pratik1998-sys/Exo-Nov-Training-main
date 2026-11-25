import { Logger } from "@logger";
import { ModuleRef } from "@nestjs/core";
import { BaseRegistry, BaseRegistryInterfaceParameter } from "@registry";
import { RegistryErrors } from "@registry/errors/registry.errors";
import { ComponentUtility } from "@utilities/component.utility";

export class RegistryUtility extends ComponentUtility {
  /**
   * The point of this field, and the methods that utilize it, are to avoid creating tokenized string tokens for ModuleRef.get with
   * each and every method invocation. Instead, put these tokens into a map to easily reference and avoid the string creation and processing
   * overhead each time.
   */
  protected static componentMap: Record<string, any> = {};

  static getRegistry<T extends BaseRegistry>(
    consumerId: string,
    registryInterface: BaseRegistryInterfaceParameter,
    moduleRef: ModuleRef,
    logger: Logger,
  ): T {
    return this.getComponentFromCache(
      consumerId,
      registryInterface.id,
      null,
      moduleRef,
      this.componentMap,
      logger,
    );
  }

  static getRegistryById(
    registryId: any,
    moduleRef: ModuleRef,
    logger: Logger,
  ): BaseRegistry {
    const methodname = `${RegistryUtility.name}.getRegistryById`;

    try {
      return moduleRef.get(registryId, { strict: false });
    } catch (error) {
      logger.info(`${methodname} - Registry not found: ${registryId}`);

      throw RegistryErrors.registryNotFound();
    }
  }

  static getRegistryIds(moduleRef: ModuleRef, logger: Logger): string[] {
    return BaseRegistry.getRegisteredRegistries();
  }
}
