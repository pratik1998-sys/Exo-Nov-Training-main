import { ConsoleLogger } from "@nestjs/common";
import { LoggerService } from "@nestjs/common/services/logger.service";
import { Logger } from "@logger";

export class NestJSLoggerServiceAdapter
  extends ConsoleLogger
  implements LoggerService
{
  constructor(private logger: Logger) {
    super();
  }

  log(message: any, ...optionalParams: any[]) {
    return this.logger.info(message, null, this.getLogData(optionalParams));
  }

  error(message: any, ...optionalParams: any[]) {
    return this.logger.error(message, null, this.getLogData(optionalParams));
  }

  warn(message: any, ...optionalParams: any[]) {
    return this.logger.warn(message, null, this.getLogData(optionalParams));
  }

  debug(message: any, ...optionalParams: any[]) {
    return this.logger.debug(message, null, this.getLogData(optionalParams));
  }

  verbose(message: any, ...optionalParams: any[]) {
    return this.logger.info(message, null, this.getLogData(optionalParams));
  }

  private getLogData(...optionalParams: any[]) {
    return {
      sourceClass: optionalParams[0] ? optionalParams[0] : undefined,
    };
  }
}
