import { RequestContext } from "@context/request";

export const LoggerKey = Symbol();

export interface LogLevel {
  id: string;
  color: string;
}

export interface LogData {
  organization?: string;
  context?: string;
  app?: string;
  sourceClass?: string;
  correlationId?: string;
  error?: Error;
  props?: NodeJS.Dict<any>;
  requestContext?: RequestContext;
}

export interface Logger {
  access(
    message: string,
    requestContext?: RequestContext,
    data?: LogData,
    profile?: string,
  );
  debug(
    message: string,
    requestContext?: RequestContext,
    data?: LogData,
    profile?: string,
  );
  info(
    message: string,
    requestContext?: RequestContext,
    data?: LogData,
    profile?: string,
  );
  warn(
    message: string | Error,
    requestContext?: RequestContext,
    data?: LogData,
    profile?: string,
  );
  error(
    message: string | Error,
    requestContext?: RequestContext,
    data?: LogData,
    profile?: string,
  );
  fatal(
    message: string | Error,
    requestContext?: RequestContext,
    data?: LogData,
    profile?: string,
  );
  emergency(
    message: string | Error,
    requestContext?: RequestContext,
    data?: LogData,
    profile?: string,
  );

  formatJSON(json: any, applyMasks?: boolean);

  startProfile(id: string);
}
