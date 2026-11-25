import { Logger } from "@logger";
import { ModuleRef } from "@nestjs/core";

export class ComponentUtility {
  /**
   * Retrieve an component class from the componentMap "cache" if it exists with the given key set, else, fetch
   * from ModuleRef via building the token in the format $consumerId.$key, and store in the componentMap "cache".
   *
   * This is to avoid creating strings for the token to fetch from the ModuleRef for each and every request.
   *
   * @param consumerId
   * @param key
   * @param subKey
   * @param moduleRef
   * @param componentMap
   * @returns
   */
  protected static getComponentFromCache(
    consumerId: string,
    key: string,
    subKey: string,
    moduleRef: ModuleRef,
    componentMap: Record<string, any>,
    logger: Logger,
  ) {
    const methodname = `${ComponentUtility.name}.getComponentFromCache`;

    if (!componentMap[consumerId]) {
      componentMap[consumerId] = {};
    }

    if (!componentMap[consumerId][key]) {
      let token = `${consumerId}.${key}`;

      if (subKey) {
        token = `${token}.${subKey}`;

        componentMap[consumerId][key] = {};

        componentMap[consumerId][key][subKey] = this.getComponentFromModuleRef(
          token,
          moduleRef,
          logger,
        );
      } else {
        componentMap[consumerId][key] = this.getComponentFromModuleRef(
          token,
          moduleRef,
          logger,
        );
      }
    }

    return subKey
      ? componentMap[consumerId][key][subKey]
      : componentMap[consumerId][key];
  }

  protected static getComponentFromModuleRef(
    token: string,
    moduleRef: ModuleRef,
    logger: Logger,
  ) {
    const methodname = `${ComponentUtility.name}.getComponentFromModuleRef`;

    let component;

    try {
      component = moduleRef.get(token, { strict: false });
    } catch (error) {
      logger.info(
        `${methodname} - Error getting component ${token} from ModuleRef: ${error}`,
      );
      if (error instanceof Error && error.stack) {
        console.error(`${methodname} - Stack trace:\n${error.stack}`);
      }
    }

    return component;
  }
}
