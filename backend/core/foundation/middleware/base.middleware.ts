import { Inject, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ModuleRef } from "@nestjs/core";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "@nestjs/cache-manager";
import { Logger, LoggerKey } from "@logger";
import { AppConfigurationKeys } from "@configuration/app";
import { RequestContext } from "@context/request";
import { RequestUtility } from "@api-utilities";
import { FastifyRequest } from "fastify";
import { GraphQLUtility } from "@api-graphql/utilities/graphql.utility";
import { ServiceUtility } from "@plugin/service/utilities/service.utility";
import { BaseFeatureServiceParameter } from "@feature/service";

export abstract class BaseMiddleware implements NestMiddleware {
  static id;
  static consumerIds: string[];
  static appConsumerIds: string[];

  static isAdminMiddleware: boolean = false;

  static consumerConfiguration: Record<string, any>;

  protected consumerIds: string[];
  protected appConsumerIds: string[];

  protected abstract execute(req: any, res: any, next: (error?: any) => void);
  protected abstract getClass(): typeof BaseMiddleware;

  constructor(
    protected configService: ConfigService,
    protected moduleRef: ModuleRef,
    @Inject(CACHE_MANAGER) protected cacheManager: Cache,
    @Inject(LoggerKey) protected logger: Logger,
  ) {
    this.consumerIds = this.getClass().consumerIds;
    this.appConsumerIds = configService.get(AppConfigurationKeys.consumerIds);
  }

  protected canMiddlewareExecute(req: any) {
    const requestConsumerId = RequestUtility.getConsumerIdFromRequest(
      req,
      this.configService,
    );

    return (
      this.getClass().isAdminMiddleware ||
      this.getClass().consumerIds.includes(requestConsumerId)
    );
  }

  protected getRequestContext(req: any): RequestContext {
    return req.requestContext;
  }

  protected getConsumerMiddlewareConfiguration<T>(consumerId: string): T {
    return (
      this.getClass().consumerConfiguration[consumerId]?.configuration ?? {}
    );
  }

  protected getService<T>(
    requestContext: RequestContext,
    service: BaseFeatureServiceParameter,
  ): T {
    return ServiceUtility.getService<T>(
      requestContext.consumer,
      service,
      this.moduleRef,
      this.logger,
    );
  }

  async use(req: any, res: any, next: (error?: any) => void) {
    if (this.canMiddlewareExecute(req)) {
      await this.execute(req, res, next);
    } else {
      //this.logger.info(`${BaseMiddleware.name}.use - [${this.middlewareId}] - Middleware disabled`);
      next();
    }
  }
}
