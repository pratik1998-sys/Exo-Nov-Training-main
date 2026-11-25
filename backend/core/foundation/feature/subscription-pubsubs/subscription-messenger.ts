import { SubscriptionConfiguration } from "@configuration/types";
import { Logger, LoggerKey } from "@logger";
import { MessengerService } from "@messenger";
import { Inject, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ModuleRef } from "@nestjs/core";
import { PubSubEngine } from "graphql-subscriptions";

/**
 * A wrapper base class to standardize the various implementations of PubSubEngine (child classes will be message specific).
 *
 * Note: Most PubSubEngine libraries properly implement PubSubEngine, however, the kafkajs one does not - it has its own
 * asyncIterable method instead of the standard asyncIterableIterator()
 */
export abstract class FeatureSubscriptionMessenger implements OnModuleInit {
  protected messengerService: MessengerService;
  protected subscriptionPubSub: PubSubEngine;

  protected abstract initializeSubscriptionPubSub();

  constructor(
    protected subscriptionConfiguration: SubscriptionConfiguration,
    protected configService: ConfigService,
    protected moduleRef: ModuleRef,
    @Inject(LoggerKey) protected logger: Logger,
  ) {}

  getSubscriptionPubSub(): PubSubEngine {
    return this.subscriptionPubSub;
  }

  getTopic(): string {
    return this.subscriptionConfiguration.topic.topic;
  }

  getMessageData(message: any): any {
    return this.messengerService.getMessageData(message);
  }

  getMessageDataString(message: any): string {
    return this.messengerService.getMessageDataString(message);
  }

  getMessengerService(): MessengerService {
    return this.messengerService;
  }

  async onModuleInit() {
    const methodname = `${FeatureSubscriptionMessenger.name}.onModuleInit`;

    await this.initializeSubscriptionPubSub();
  }
}
