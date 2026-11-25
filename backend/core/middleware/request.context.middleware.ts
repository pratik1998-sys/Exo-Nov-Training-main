import { Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v4 as uuidv4 } from "uuid";
import { ModuleRef } from "@nestjs/core";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "@nestjs/cache-manager";
import { BaseMiddleware } from "@middleware-foundation";
import { Logger, LoggerKey } from "@logger";
import { AppConfigurationKeys } from "@configuration/app";
import { RequestUtility } from "@api-utilities";
import { getAuthTokenFromRequest } from "@api/shared/cookies";
import { Headers } from "@api-headers";
import { RequestContext } from "@context/request";
import { StringUtility } from "@utilities";
import { TokenUtility } from "@token/utilities/token.utility";
import { FeatureErrors } from "@feature/error";

export class RequestContextMiddleware extends BaseMiddleware {
  protected locales = [];
  protected defaultLocale = null;
  protected consumerIds = [];

  protected getClass() {
    return RequestContextMiddleware;
  }

  constructor(
    protected configService: ConfigService,
    protected moduleRef: ModuleRef,
    @Inject(CACHE_MANAGER) protected cacheManager: Cache,
    @Inject(LoggerKey) protected logger: Logger,
  ) {
    const methodname = `${RequestContextMiddleware.name}.constructor`;

    super(configService, moduleRef, cacheManager, logger);

    const locales = this.configService.get(AppConfigurationKeys.locales);

    if (locales && locales.length > 0) {
      locales.forEach((locale) => {
        this.locales.push(locale.id);

        if (locale.default) {
          this.defaultLocale = locale.id;
        }
      });
    } else {
      this.logger.warn(
        `${methodname} - No supported locales found in app configuration`,
      );
      throw new Error("CONFIG_MISSING_SUPPORTED_LOCALES");
    }

    if (this.defaultLocale == null) {
      this.logger.warn(
        `${methodname} - No default locale configured in app configuration`,
      );
      throw new Error("CONFIG_MISSING_DEFAULT_LOCALE");
    }
  }

  protected async execute(req: any, res: any, next: () => void) {
    // Nest Fastify middleware may receive IncomingMessage (req.raw). @fastify/cookie parses onto
    // FastifyRequest; NestServer copies cookies onto raw.cookies in an onRequest hook.
    // GraphQL context uses FastifyRequest (ctx.req.cookies). getAuthTokenFromRequest handles both.

    req.requestContext = req.requestContext ?? {};

    req.requestContext = this.buildRequestContext(req);

    this.addResponseHeaders(req, res);

    next();
  }

  protected buildRequestContext(req: any) {
    const localeObj = this.resolveLocale(req);

    let consumerId = RequestUtility.getConsumerIdFromRequest(
      req,
      this.configService,
    );

    if (!this.appConsumerIds.includes(consumerId)) {
      throw FeatureErrors.invalidConsumer();
    }

    //Weird bug on inbound requests from NextJS
    // if (req.headers[Headers.ecToken.name] == 'undefined') {
    //     delete req.headers[Headers.ecToken.name];
    // }
    if (req.headers[Headers.token.name] == "undefined") {
      delete req.headers[Headers.token.name];
    }

    const requestContext: RequestContext = {
      correlationId: req.headers[Headers.correlationId.name] || uuidv4(),
      requestId: req.headers[Headers.requestId.name] || uuidv4(),
      service: `${req.method} ${req.url}`,
      locale: localeObj.locale,
      language: localeObj.language,
      country: localeObj.country,
      consumer: RequestUtility.getConsumerIdFromRequest(
        req,
        this.configService,
      ),
      // TODO - Research timezone header from client, probably need ot send a custom one. This may be needed for SSR
      // code that is parsing dates, as the SSR server will be hosted somewhere possibly not in the client timezone.
      timezone: "",

      //currency: this.resolveCurrency(req),

      idpUserId: "",
      // authorizationToken: req.headers[Headers.authorizationToken.name] || undefined,
      // account: req.headers[Headers.account.name] || undefined,
      user: null,
      integrations: [],
    };

    this.processAPIKey(requestContext, req);

    this.processToken(requestContext, req);

    // this.processECToken(requestContext, req);

    return requestContext;
  }

  // protected processECToken(requestContext: RequestContext, req: any) {
  //     const token = TokenUtility.decryptToken(requestContext, req.headers[Headers.ecToken.name] || undefined);

  //     requestContext.ecToken = token;
  // }

  protected processAPIKey(requestContext: RequestContext, req: any) {
    requestContext.apiKey = req.headers[Headers.apiKey.name] || undefined;

    if (StringUtility.isStringNotEmpty(requestContext.apiKey)) {
      const arr = Buffer.from(requestContext.apiKey, "base64")
        .toString()
        .split(":");

      if (arr.length == 2) {
        requestContext.clientId = arr[0];
        requestContext.clientSecret = arr[1];
      }
    }
  }

  protected processToken(requestContext: RequestContext, req: any) {
    const headerToken = req.headers[Headers.token.name];
    const cookieToken = getAuthTokenFromRequest(req);

    const token = TokenUtility.decryptTokens(
      requestContext,
      headerToken || cookieToken || undefined,
    );

    requestContext.tokens = token;
  }

  protected addResponseHeaders(req: any, res: any) {
    res.setHeader(Headers.correlationId.name, req.requestContext.correlationId);
    res.setHeader(Headers.requestId.name, req.requestContext.requestId);
  }

  protected resolveLocale(req: any): LocaleLanguageCountry {
    let obj: LocaleLanguageCountry = this.processLocale(
      req.headers[Headers.locale.name],
    );

    if (!obj) {
      obj = this.processLocale(this.defaultLocale);
    }

    return obj;
  }

  protected processLocale(locale: string): LocaleLanguageCountry {
    const methodname = `${RequestContextMiddleware.name}.processLocale`;

    let obj: LocaleLanguageCountry;

    if (locale) {
      const arr = locale.split("-");

      if (arr.length == 2) {
        arr[1] = arr[1].toUpperCase();

        obj = {
          language: arr[0],
          country: arr[1],
          locale: arr.join("-"),
        };

        if (!this.locales.includes(obj.locale)) {
          this.logger.info(
            `${methodname} - Request locale ${obj.locale} is not a supported locale`,
          );
          obj = null;
        }
      }
    }

    return obj;
  }
}

interface LocaleLanguageCountry {
  language: string;
  country: string;
  locale: string;
}
