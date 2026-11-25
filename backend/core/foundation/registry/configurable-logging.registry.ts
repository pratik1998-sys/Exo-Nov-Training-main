import { BaseRegistry } from "@registry";

export abstract class ConfigurableLoggingRegistry extends BaseRegistry {
  protected data: Record<string, any> = {};

  protected static readonly wildcard = "*";

  protected doLogging = false;

  protected abstract getLoggingConfigKey();

  isEnabled(): boolean {
    return true;
  }

  protected async load() {
    const methodname = `${ConfigurableLoggingRegistry.name}.load`;

    const loggingConfig = await this.fetchData();

    const mapperLoggingMap: any = {};

    Object.keys(loggingConfig).forEach((loggingConfigId) => {
      const arr = loggingConfigId.split(".");

      let obj: any = mapperLoggingMap;

      arr.forEach((token, i) => {
        if (i == arr.length - 1) {
          obj[token] = loggingConfig[loggingConfigId];

          if (obj[token]) {
            this.doLogging = true;
          }
        } else {
          if (!obj[token]) {
            obj[token] = {};
          }

          obj = obj[token];
        }
      });
    });

    this.data = mapperLoggingMap;

    this.logger.info(
      `${methodname} - ${this.registryId} - Do Logging: ${this.doLogging}, Loaded registry data: ${this.logger.formatJSON(this.data)} `,
    );
  }

  //TODO - Add REDIS capability
  protected async fetchData() {
    const methodname = `${ConfigurableLoggingRegistry.name}.fetchData`;

    let loggingConfig = this.configService.get(this.getLoggingConfigKey());

    loggingConfig = loggingConfig ? JSON.parse(loggingConfig) : {};

    return loggingConfig;
  }

  /**
   * This will update the registry data as IDs that aren't explicitly specified yet are calling,
   * to avoid unnecessary wildcard/missing checks in subsequent calls of that ID.
   *
   * @param obj
   * @param key
   * @param isLeaf
   * @returns
   */
  protected getDataValue(obj: any, key: string, isLeaf: boolean) {
    if (!obj.hasOwnProperty(key)) {
      const wildcardVal = obj[ConfigurableLoggingRegistry.wildcard];

      if (isLeaf) {
        obj[key] = wildcardVal ?? false;
      } else {
        obj[key] = wildcardVal
          ? { [ConfigurableLoggingRegistry.wildcard]: wildcardVal }
          : {};
      }
    }

    return obj[key];
  }

  updateDataValue(id: string, value: boolean) {
    const methodname = `${ConfigurableLoggingRegistry.name}.updateDataValue`;

    this.logger.info(`${methodname} - Updating id ${id} to ${value}`);

    this.logger.info(
      `${methodname} - Pre-update Registry Data: ${this.logger.formatJSON(this.data)}`,
    );

    const arr = id.split(".");

    let obj = this.data;

    arr.forEach((token, i) => {
      if (!obj[token]) {
        obj[token] = {};
      }

      if (i == arr.length - 1) {
        obj[token] = value;
      } else if (typeof obj[token] == "boolean") {
        obj[token] = {
          [ConfigurableLoggingRegistry.wildcard]: obj[token],
        };
      }

      obj = obj[token];
    });

    this.logger.info(
      `${methodname} - Post-update Registry Data: ${this.logger.formatJSON(this.data)}`,
    );
  }

  getRegistryData() {
    return this.data;
  }
}
