import { EnvironmentVariableKeys } from "@configuration/environment";
import { ConfigurableLoggingRegistry } from "@registry/configurable-logging.registry";

export class MapperLoggingRegistry extends ConfigurableLoggingRegistry {
  protected getLoggingConfigKey() {
    return EnvironmentVariableKeys.mapperLogging;
  }

  isMapperLoggingEnabled(
    featureId: string,
    pluginId: string,
    mapperId: string,
  ) {
    let val = this.doLogging;

    if (val) {
      val = this.getDataValue(this.data, pluginId, false);
      val = this.getDataValue(val, featureId, false);
      val = this.getDataValue(val, mapperId, true);
    }

    return val;
  }
}
