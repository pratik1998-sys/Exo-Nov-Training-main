import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ModuleRef } from "@nestjs/core";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "@nestjs/cache-manager";
import { BaseMiddleware } from "@middleware-foundation";
import { Logger, LoggerKey } from "@logger";
import { ConfigurationUtility } from "@configuration/utilities";
import { EnvironmentVariableKeys } from "@configuration/environment";
import { GraphQLUtility } from "@api-graphql/utilities/graphql.utility";

@Injectable()
export class AccessLoggingMiddleware extends BaseMiddleware {
  protected isAccessLoggingEnabled: boolean;

  protected getClass() {
    return AccessLoggingMiddleware;
  }

  constructor(
    protected configService: ConfigService,
    protected moduleRef: ModuleRef,
    @Inject(CACHE_MANAGER) protected cacheManager: Cache,
    @Inject(LoggerKey) protected logger: Logger,
  ) {
    const methodname = `${AccessLoggingMiddleware.name}()`;

    super(configService, moduleRef, cacheManager, logger);

    this.isAccessLoggingEnabled = ConfigurationUtility.getBooleanValue(
      configService,
      EnvironmentVariableKeys.accessLogging,
    );

    this.logger.info(
      `${methodname} - Is Access Logging Enabled: ${this.isAccessLoggingEnabled}`,
    );
  }

  protected async execute(req: any, res: any, next: () => void) {
    if (this.isAccessLoggingEnabled) {
      const audit: any = {
        start: new Date().getTime(),
      };

      res.on("finish", () => {
        if (!GraphQLUtility.isIntrospectionQuery(req.requestContext)) {
          audit.end = new Date().getTime();

          let args = {};

          let message = `Execution time: ${audit.end - audit.start}ms`;

          let body = null;

          if (req.requestContext.graphql?.service) {
            message = `${message}, Parsing time: ${req.requestContext.graphql.parsingTime}ms`;
            args = req.requestContext.graphql.args;
          } else {
            args = req.query;
            body = req.body;
          }

          message = `${message} - Params: ${this.logger.formatJSON(args, true)}`;

          if (body) {
            message = `${message} - Body: ${this.logger.formatJSON(body, true)}`;
          }

          message = `${message} - Integrations: ${this.logger.formatJSON(req.requestContext.integrations)}`;

          this.logger.access(message, req.requestContext);
        }
      });
    }

    next();
  }
}
