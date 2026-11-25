import { Header, HeaderTypes } from "@api-headers";
import { AppConfigurationKeys } from "@configuration/app";
import { ConfigurationUtility } from "@configuration/utilities";
import { ConfigService } from "@nestjs/config";
import { v4 as uuidv4 } from "uuid";

export class HeaderUtility {
  static getHeaderDefaultValue(header: Header, configuration: object) {
    let defaultVal;

    if (header.type == HeaderTypes.consumer) {
      defaultVal = ConfigurationUtility.getConfigurationValueListDefaultId(
        configuration,
        AppConfigurationKeys.consumers,
        "default",
      );
    } else if (header.type == HeaderTypes.locale) {
      defaultVal = ConfigurationUtility.getConfigurationValueListDefaultId(
        configuration,
        AppConfigurationKeys.locales,
        "en-us",
      );
    } else if (header.type == HeaderTypes.uuid) {
      defaultVal = uuidv4();
    }

    return defaultVal;
  }

  static getHeaderDefaultValueFromConfigService(
    header: Header,
    config: ConfigService,
  ) {
    let defaultVal;

    if (header.type == HeaderTypes.consumer) {
      defaultVal =
        ConfigurationUtility.getConfigurationServiceValueListDefaultId(
          config,
          AppConfigurationKeys.consumers,
          "default",
        );
    } else if (header.type == HeaderTypes.locale) {
      defaultVal =
        ConfigurationUtility.getConfigurationServiceValueListDefaultId(
          config,
          AppConfigurationKeys.locales,
          "en-us",
        );
    } else if (header.type == HeaderTypes.uuid) {
      defaultVal = uuidv4();
    } else if (header.type == HeaderTypes.text) {
      defaultVal = "value";
    }

    return defaultVal;
  }
}
