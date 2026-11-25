import { ConfigService } from "@nestjs/config";
import { AppConfiguration } from "@configuration/types";
import { AppConfigurationKeys } from "@configuration/app";

export class LoggerUtility {
  private static readonly mask = "******";
  private static readonly bearer = "BEARER";
  private static readonly basic = "BASIC";

  static applyMasks(
    obj: any,
    configuration: AppConfiguration,
    configService: ConfigService,
    additionalMaskedFields: string[] = [],
  ) {
    let maskedFields = configuration
      ? configuration.loggerMaskedFields
      : configService.get(AppConfigurationKeys.loggerMaskedFields);

    maskedFields = [...maskedFields, ...additionalMaskedFields];

    const objCopy = { ...obj };

    for (let prop in objCopy) {
      if (maskedFields.includes(prop)) {
        objCopy[prop] = LoggerUtility.mask;
      } else if (typeof objCopy[prop] == "object") {
        objCopy[prop] = this.applyMasks(
          objCopy[prop],
          configuration,
          configService,
        );
      } else if (typeof objCopy[prop] === "string") {
        var upperValue = objCopy[prop].toUpperCase();

        if (upperValue.startsWith(LoggerUtility.bearer)) {
          objCopy[prop] = `Bearer ${LoggerUtility.mask}`;
        } else if (upperValue.startsWith(LoggerUtility.basic)) {
          objCopy[prop] = `Basic ${LoggerUtility.mask}`;
        }
      }
    }

    return objCopy;
  }

  static toStringWithMasks(
    obj: any,
    configuration: AppConfiguration,
    configService: ConfigService,
    additionalMaskedFields: string[] = [],
  ) {
    return JSON.stringify(
      this.applyMasks(
        obj,
        configuration,
        configService,
        additionalMaskedFields,
      ),
    );
  }
}
