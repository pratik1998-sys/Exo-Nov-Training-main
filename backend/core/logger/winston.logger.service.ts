import * as winston from "winston";
import { ConfigService } from "@nestjs/config";
import { ModuleRef } from "@nestjs/core";
import { BaseLoggerServiceImpl, LogData, LogLevel } from "@logger";
import { RequestContext } from "@context/request";

export class WinstonLoggerServiceImpl extends BaseLoggerServiceImpl {
  protected logger: winston.Logger;

  constructor(
    protected configService: ConfigService,
    moduleRef: ModuleRef,
  ) {
    super(configService, moduleRef);

    this.createLogger();
  }

  protected createLogger() {
    this.logger = winston.createLogger(this.getLoggerFormatOptions());
  }

  protected getLoggerFormatOptions() {
    const transports: winston.transport[] = this.createTransports();

    const levels: any = {};
    Object.values(this.logLevels).forEach((logLevel, i) => {
      levels[logLevel.id] = i;
    });

    return {
      level: this.logLevels.debug.id,
      levels: levels,
      format: winston.format.combine(
        winston.format.timestamp({
          format: "YYYY-MM-DD hh:mm:ss.SSS",
        }),

        winston.format.errors({ stack: true }),

        winston.format((info, opts) => {
          if (info.error && info.error instanceof Error) {
            info.stack = info.error.stack;
            info.error = undefined;
          }
          return info;
        })(),

        winston.format.metadata({
          key: "data",
          fillExcept: ["timestamp", "level", "message"],
        }),

        winston.format.json(),
      ),
      transports: transports,
      exceptionHandlers: transports,
      rejectionHandlers: transports,
    };
  }

  log(
    level: LogLevel,
    message: string | Error,
    requestContext?: RequestContext,
    data?: LogData,
    profile?: string,
  ) {
    const logData = {
      level: level.id,
      message: message instanceof Error ? message.message : message,
      error: message instanceof Error ? message : undefined,
      requestContext: requestContext,
      ...data,
    };

    if (profile) {
      this.logger.profile(profile, logData);
    } else {
      this.logger.log(logData);
    }
  }

  startProfile(id: string) {
    this.logger.profile(id);
  }

  protected createTransports() {
    return [this.createTransport_Console()];
  }

  protected createTransport_Console() {
    return new winston.transports.Console({
      format: winston.format.combine(
        winston.format.printf((log) => {
          const { color } = this.logLevels[log.level] ?? this.logLevels.default;

          const logData: any = log.data;

          const prefix = `${logData.label ? `[${logData.label}] - ` : ""}`;

          const { timestamp, message } = log;
          const { sourceClass, error, durationMs, stack, props } = logData;

          const requestContext: RequestContext = logData.requestContext
            ? logData.requestContext
            : {};

          const { correlationId, service, locale, idpUserId, requestId } =
            requestContext;

          let logStr = `${this.colorize(color, prefix)}[${timestamp}] ${this.colorize(color, log.level.toUpperCase())}`;

          if (correlationId) {
            logStr = `${logStr} ${this.colorize(this.logColors.cyan, `[cid=${correlationId}]`)}`;
          }

          if (service) {
            let reqContextStr = `[${service} reqId=${requestId}`;

            if (locale) {
              reqContextStr = `${reqContextStr} locale=${locale}`;
            }

            if (idpUserId) {
              reqContextStr = `${reqContextStr} user=${idpUserId}`;
            }

            reqContextStr = `${reqContextStr}]`;

            logStr = `${logStr} ${this.colorize(this.logColors.magenta, reqContextStr)}`;
          }

          logStr = `${logStr} ${message}`;

          if (error) {
            logStr = `${logStr} - ${error}`;
          }

          if (durationMs !== undefined) {
            logStr = `${logStr} (${durationMs}ms)`;
          }

          if (stack) {
            logStr = `${logStr} ${this.colorize(color, `- ${stack}`)}`;
          }

          if (props) {
            logStr = `${logStr}\n Props: ${JSON.stringify(props, null, 2)}`;
          }

          return logStr;
        }),
      ),
    });
  }
}
