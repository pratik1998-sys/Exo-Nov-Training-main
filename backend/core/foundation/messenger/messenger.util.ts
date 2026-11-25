import { Logger } from "@logger";
import { ModuleRef } from "@nestjs/core";
import { MessengerConfiguration } from "@configuration/types";
import { EnvironmentVariableKeys } from "@configuration/environment";
import { MessengerModule, MessengerService } from "@messenger";

export class MessengerUtility {
  private static messageServices: Record<string, MessengerService> = {};
  private static appMessengerConfiguration: any;

  static resolveMessenger(
    messageId: string,
    moduleRef: ModuleRef,
    logger: Logger,
  ): MessengerService {
    const methodname = `${MessengerUtility.name}.resolveMessenger`;

    if (!this.messageServices[messageId]) {
      let message: MessengerService = null;

      const token = MessengerModule.composeMessengerServiceToken(messageId);

      try {
        this.messageServices[messageId] = moduleRef.get(token, {
          strict: false,
        });
      } catch (error) {
        logger.info(
          `${methodname} - Did not find message service ${messageId} with token ${token}`,
        );
      }
    }

    return this.messageServices[messageId];
  }

  static getAppMessengerConfig(): Record<string, MessengerConfiguration> {
    if (!this.appMessengerConfiguration) {
      this.appMessengerConfiguration = JSON.parse(
        process.env[EnvironmentVariableKeys.messengers],
      );
    }

    return this.appMessengerConfiguration;
  }
}
