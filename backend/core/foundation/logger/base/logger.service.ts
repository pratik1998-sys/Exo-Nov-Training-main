import { RequestContext } from "@context/request";
import { ConfigService } from "@nestjs/config";

import { ModuleRef } from "@nestjs/core";
import { EnvironmentVariableValues } from "@configuration/environment";
import { AppConfigurationKeys } from "@configuration/app";
import { LogData, Logger, LogLevel } from "@logger";
import { LoggerUtility } from "@logger/utilities";

export abstract class BaseLoggerServiceImpl implements Logger {
  abstract log(
    level: LogLevel,
    message: string | Error,
    requestContext?: RequestContext,
    data?: LogData,
    profile?: string,
  );

  abstract startProfile(id: string);

  protected readonly logColors = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    pink: "\x1b[38;5;206m",
  };

  protected readonly logLevels: Record<string, LogLevel> = {
    access: {
      id: "access",
      color: this.logColors.yellow,
    },
    emergency: {
      id: "emergency",
      color: this.logColors.pink,
    },
    fatal: {
      id: "fatal",
      color: this.logColors.magenta,
    },
    error: {
      id: "error",
      color: this.logColors.red,
    },
    warn: {
      id: "warn",
      color: this.logColors.yellow,
    },
    info: {
      id: "info",
      color: this.logColors.green,
    },
    debug: {
      id: "debug",
      color: this.logColors.blue,
    },
    default: {
      id: "default",
      color: this.logColors.cyan,
    },
  };

  protected doPrettify: boolean = false;
  protected doColor: boolean = false;

  constructor(
    protected configService: ConfigService,
    protected moduleRef: ModuleRef,
  ) {
    if (this.configService) {
      const appNodeEnv = this.configService.get(
        AppConfigurationKeys.appNodeEnv,
      );

      this.doPrettify =
        EnvironmentVariableValues.appNodeEnv.local == appNodeEnv;
      this.doColor = EnvironmentVariableValues.appNodeEnv.local == appNodeEnv;
    }
  }

  debug(
    message: string,
    requestContext?: RequestContext,
    data?: LogData,
    profile?: string,
  ) {
    this.log(this.logLevels.debug, message, requestContext, data, profile);
  }

  access(
    message: string,
    requestContext?: RequestContext,
    data?: LogData,
    profile?: string,
  ) {
    this.log(this.logLevels.access, message, requestContext, data, profile);
  }

  info(
    message: string,
    requestContext?: RequestContext,
    data?: LogData,
    profile?: string,
  ) {
    this.log(this.logLevels.info, message, requestContext, data, profile);
  }

  warn(
    message: string | Error,
    requestContext?: RequestContext,
    data?: LogData,
    profile?: string,
  ) {
    this.log(this.logLevels.warn, message, requestContext, data, profile);
  }

  error(
    message: string | Error,
    requestContext?: RequestContext,
    data?: LogData,
    profile?: string,
  ) {
    this.log(this.logLevels.error, message, requestContext, data, profile);
  }

  fatal(
    message: string | Error,
    requestContext?: RequestContext,
    data?: LogData,
    profile?: string,
  ) {
    this.log(this.logLevels.fatal, message, requestContext, data, profile);
  }

  emergency(
    message: string | Error,
    requestContext?: RequestContext,
    data?: LogData,
    profile?: string,
  ) {
    this.log(this.logLevels.emergency, message, requestContext, data, profile);
  }

  /**
   * Stringify JSON objects with appropriate format given the environment
   *
   * Why? Local should have a nice prettified version for easy developer reading. However, environments
   * should have a non-prettified version, as log aggregators such as NewRelic, or cloud native log aggregators
   * tend to have one "line" considered one log entry, which is not true and makes debugging very difficult
   *
   * @param json
   * @returns
   */
  formatJSON(json: any, applyMasks?: boolean) {
    if (applyMasks) {
      json = LoggerUtility.applyMasks(json, null, this.configService);
    }

    return this.doPrettify
      ? JSON.stringify(json, null, 2)
      : JSON.stringify(json);
  }

  protected colorize(color: string, message: string): string {
    return this.doColor ? `${color}${message}\x1b[0m` : message;
  }
}
