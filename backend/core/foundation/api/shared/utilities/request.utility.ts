import { Headers } from "@api-headers";
import { AppConfigurationKeys } from "@configuration/app";
import { ConfigService } from "@nestjs/config";

/**
 *  This is a utility class to handle functionality on the inbound raw request
 */
export class RequestUtility {
  static getConsumerIdFromRequest(req: any, configService: ConfigService) {
    return req.headers[Headers.consumer.name] &&
      req.headers[Headers.consumer.name].trim() != ""
      ? req.headers[Headers.consumer.name].toLowerCase()
      : configService.get(AppConfigurationKeys.defaultConsumerId);
  }
}
