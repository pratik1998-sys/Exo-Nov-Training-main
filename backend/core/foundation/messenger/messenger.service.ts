import { MessengerConfiguration } from "@configuration/types";
import { RequestContext } from "@context/request";
import { Logger, LoggerKey } from "@logger";
import { MessengerLoggingRegistry } from "@messenger";
import { Inject, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ModuleRef } from "@nestjs/core";

export abstract class MessengerService implements OnModuleInit {
  protected id: string;

  //Some NestJS message classes have the underlying driver unwrapped as a single class (ie Kafka)
  //while others have it unwrapped into separate classes for pub and sub (ie Redis)
  protected client: any;
  protected pub: any;
  protected sub: any;

  protected loggingRegistry: MessengerLoggingRegistry;

  protected abstract doSend(topic: string, data: any);
  protected abstract initializeInboundMessageLogging();

  abstract getMessageData(message: any);
  abstract getMessageDataString(message: any);

  constructor(
    protected messengerConfig: MessengerConfiguration,
    protected configService: ConfigService,
    protected moduleRef: ModuleRef,
    @Inject(LoggerKey) protected logger: Logger,
  ) {
    this.id = this.messengerConfig.id;

    this.loggingRegistry = MessengerLoggingRegistry.getInstance();
  }

  getClient() {
    return this.client;
  }

  getPub() {
    return this.pub;
  }

  getSub() {
    return this.sub;
  }

  getId(): string {
    return this.id;
  }

  getMessengerConfig(): MessengerConfiguration {
    return this.messengerConfig;
  }

  send(topic: string, data: any, requestContext: RequestContext) {
    const methodname = `${MessengerService.name}.send`;

    if (this.loggingRegistry.isMessengerLoggingEnabled(this.id, topic)) {
      this.logger.info(
        `${methodname} Messenger [${this.id}] Outbound Messenger - Topic: ${topic}, Messenger: ${JSON.stringify(data)}`,
        requestContext,
      );
    }

    this.doSend(topic, data);
  }

  protected logInboundMessage(topic: string, message: string) {
    const methodname = `${MessengerService.name}.logInboundMessage`;

    if (this.loggingRegistry.isMessengerLoggingEnabled(this.id, topic)) {
      this.logger.info(
        `${methodname} Messenger [${this.id}] Inbound Messenger - Topic: ${topic}, Messenger: ${message}`,
      );
    }
  }

  protected getMessengerClient() {
    return this.moduleRef.get(`messagenger:${this.messengerConfig.id}`, {
      strict: false,
    });
  }

  protected registerMessenger() {
    const registry: MessengerLoggingRegistry =
      MessengerLoggingRegistry.getInstance();

    const { topics } = this.getMessengerConfig();

    registry.registerMessengerTopics(
      this.id,
      Object.values(topics).map((topic) => topic.id),
    );
  }

  async onModuleInit() {
    const methodname = `${MessengerService.name}.onModuleInit`;

    this.registerMessenger();

    await this.initializeInboundMessageLogging();
  }
}
