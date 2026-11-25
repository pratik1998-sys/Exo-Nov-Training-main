import { AppConfigurationKeys } from "@configuration/app";
import { RequestContext } from "@context/request";
import { FeatureErrors } from "@feature/error";
import {
  BaseFeatureService,
  BaseFeatureServiceParameter,
} from "@feature/service";
import { Logger, LoggerKey } from "@logger";
import { MessengerService, MessengerUtility } from "@messenger";
import { Inject, OnModuleInit, Optional } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ModuleRef } from "@nestjs/core";
import { ServiceUtility } from "@plugin/service/utilities/service.utility";
import { FeatureModuleData } from "@server/loader/types/loader.types";

export abstract class BaseFeatureComponent implements OnModuleInit {
  //These are static to be able to reference in @Subscription decorator flows

  protected static feature: FeatureModuleData;
  protected static moduleRef: ModuleRef;
  protected static logger: Logger;

  protected abstract getRequestContext(request: any): RequestContext;

  protected appConsumerIds: string[];

  /**
   * Feature is optional as Nest Controller entities cannot be explicitly instantiated
   * in useFactory(...)
   * @param feature
   * @param configService
   * @param moduleRef
   * @param logger
   */
  constructor(
    @Optional()
    protected feature: FeatureModuleData,
    protected configService: ConfigService,
    protected moduleRef: ModuleRef,
    @Inject(LoggerKey) protected logger: Logger,
  ) {
    this.appConsumerIds = this.configService.get(
      AppConfigurationKeys.consumerIds,
    );

    // BaseFeatureComponent.moduleRef = moduleRef;
    // BaseFeatureComponent.logger = logger;

    // //This is so dirty...but a work around for Nest Controllers
    // if (!this.feature) {
    //     this.feature = BaseFeatureComponent.feature;
    // } else {
    //     BaseFeatureComponent.feature = feature;
    // }

    // Assign to the actual class being constructed (child), not the base, so each subclass has its own statics.
    const classObj = this.constructor as typeof BaseFeatureComponent;
    classObj.moduleRef = moduleRef;
    classObj.logger = logger;

    if (!this.feature) {
      this.feature = classObj.feature;
    } else {
      classObj.feature = feature;
    }
  }

  protected resolveService<T extends BaseFeatureService>(
    requestContext: RequestContext,
    serviceInterface: BaseFeatureServiceParameter,
    isAdminService: boolean = false,
  ): T {
    const { consumer } = requestContext;

    if (isAdminService) {
      return ServiceUtility.getAdminService(serviceInterface, this.moduleRef);
    } else {
      if (!this.appConsumerIds.includes(consumer)) {
        throw FeatureErrors.invalidConsumer();
      }

      return ServiceUtility.getService(
        consumer,
        serviceInterface,
        this.moduleRef,
        this.logger,
      );
    }
  }

  protected resolveMessenger(messengerId: string): MessengerService {
    return MessengerUtility.resolveMessenger(
      messengerId,
      this.moduleRef,
      this.logger,
    );
  }

  protected sendMessage(
    requestContext: RequestContext,
    messageId: string,
    topic: string,
    message: any,
  ) {
    this.resolveMessenger(messageId).send(topic, message, requestContext);
  }

  protected getFeatureConfiguration<T>(): T {
    const featureConfig: Record<string, any> = this.configService.get(
      AppConfigurationKeys.configuredFeatures,
    );

    if (this.feature.group) {
      return featureConfig[this.feature.group].configuredFeatures[
        this.feature.id
      ];
    } else {
      return featureConfig[this.feature.id];
    }
  }

  protected getRequestContextAndService<T extends BaseFeatureService>(
    request: any,
    serviceInterface: BaseFeatureServiceParameter,
  ): { requestContext: RequestContext; service: T } {
    const requestContext = this.getRequestContext(request);

    return {
      requestContext,
      service: this.resolveService<T>(requestContext, serviceInterface),
    };
  }

  async onModuleInit() {}
}
