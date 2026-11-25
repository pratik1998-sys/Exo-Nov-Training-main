import { ConfigService } from "@nestjs/config";

export class ConfigurationUtility {
  static getConfigurationValue = (
    config: ConfigService,
    key: string,
    defaultValue: any,
  ) => {
    const value = config.get(key);

    return value ? value : defaultValue;
  };

  static getConfigurationServiceValueListDefaultId = (
    config: ConfigService,
    key: string,
    defaultValue: any,
  ) => {
    return this.getValueListDefaultId(config.get(key), defaultValue);
  };

  static getConfigurationValueListDefaultId(
    configuration: any,
    key: string,
    defaultValue: string,
  ) {
    return this.getValueListDefaultId(configuration[key], defaultValue);
  }

  static getConfigurationServiceValueListDefault = (
    config: ConfigService,
    key: string,
  ) => {
    return this.getValueListDefault(config.get(key));
  };

  static getConfigurationValueListDefault(configuration: any, key: string) {
    return this.getValueListDefault(configuration[key]);
  }

  protected static getValueListDefault(values: object[]) {
    const defaultObj: any = Object.values(values).find((value: any) => {
      return value.default;
    });

    return defaultObj;
  }

  protected static getValueListDefaultId(
    values: object[],
    defaultValue: string,
  ) {
    const defaultObj: any = this.getValueListDefault(values);

    return defaultObj ? defaultObj.id : defaultValue;
  }
  /**
   *  environment variables that are true|false are strings
   *
   * @param config
   * @param key
   * @returns
   */
  static getBooleanValue(config: ConfigService, key: string) {
    const value = config.get(key);

    return typeof value === "string" ? this.parseBoolean(value) : value;
  }

  static parseBoolean(value: string) {
    return value ? value.toLocaleLowerCase() === "true" : false;
  }
}
