import { EnvironmentVariableKeys } from "@configuration/environment";
import { ConfigurableLoggingRegistry } from "@registry/configurable-logging.registry";

export class MessengerLoggingRegistry extends ConfigurableLoggingRegistry {
  private messageRegistry: Record<string, string[]> = {};

  protected getLoggingConfigKey() {
    return EnvironmentVariableKeys.messengerLogging;
  }

  isMessengerLoggingEnabled(messageId: string, topic: string) {
    let val = this.doLogging;

    if (val) {
      val = this.getDataValue(this.data, messageId, false);
      val = this.getDataValue(val, topic, true);
    }

    return val;
  }

  registerMessengerTopic(messageId: string, topic: string) {
    const methodname = `${MessengerLoggingRegistry.name}.registerMessengerTopics`;

    this.logger.info(
      `${methodname} - Registering message ${messageId} topics: ${topic}`,
    );

    if (!this.messageRegistry[messageId]) {
      this.messageRegistry[messageId] = [];
    }

    this.messageRegistry[messageId].push(topic);
  }

  registerMessengerTopics(messageId: string, topics: string[]) {
    const methodname = `${MessengerLoggingRegistry.name}.registerMessengerTopics`;

    this.logger.info(
      `${methodname} - Registering message ${messageId} topics: ${this.logger.formatJSON(topics)}`,
    );

    if (!this.messageRegistry[messageId]) {
      this.messageRegistry[messageId] = [];
    }

    topics.forEach((topic) => {
      if (!this.messageRegistry[messageId].includes(topic)) {
        this.messageRegistry[messageId].push(topic);
      }
    });
  }

  getMessengerRegistry() {
    return this.messageRegistry;
  }
}
