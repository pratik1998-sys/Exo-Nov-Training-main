import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ModuleRef, Reflector } from "@nestjs/core";
import { GqlContextType } from "@nestjs/graphql";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@logger";
import { AppConfigurationKeys } from "@configuration/app";
import { RequestContext } from "@context/request";
import {
  Api,
  ApiOperation,
  ApiOptions,
  GraphQLOperationOptions,
  RestAPIOptions,
} from "@api-decorators";
import { FeatureModuleData } from "@server/loader/types/loader.types";
import { StringUtility } from "@utilities";

@Injectable()
export class AuthorizationGuard implements CanActivate {
  protected consumerIds: string[];
  protected appConsumerIds: string[];

  constructor(
    protected reflector: Reflector,
    protected config: ConfigService,
    protected logger: Logger,
    protected moduleRef: ModuleRef,
  ) {
    this.consumerIds = config.get(AppConfigurationKeys.consumerIds);
    this.appConsumerIds = config.get(AppConfigurationKeys.consumerIds);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const methodname = `${AuthorizationGuard.name}.canActivate`;

    let isAllowed = true;

    const requestContext: RequestContext = this.getRequestContext(context);

    const api = this.reflector.get(Api, context.getClass());
    const apiOperation = this.reflector.get(ApiOperation, context.getHandler());

    isAllowed = this.isAPIAccessAuthorized(
      requestContext,
      context,
      api,
      apiOperation,
    );

    if (isAllowed) {
      isAllowed = await this.isAPIUserAuthorized(
        requestContext,
        context,
        api,
        apiOperation,
      );
    }

    return isAllowed;
  }

  protected isAPIAccessAuthorized(
    requestContext: RequestContext,
    context: ExecutionContext,
    api: ApiOptions,
    apiOperation: GraphQLOperationOptions | RestAPIOptions,
  ): boolean {
    const methodname = `${AuthorizationGuard.name}.isAPIAccessAuthorized`;

    let isAuthorized = true;

    const { suppressAPIAccessControl, id } = apiOperation ?? {};

    if (!suppressAPIAccessControl) {
      const isAPIAccessControlEnabled = this.config.get<boolean>(
        AppConfigurationKeys.doAPIAccessControl,
      );

      if (isAPIAccessControlEnabled) {
        const apiAccessControl = this.config.get(
          AppConfigurationKeys.apiAccessControl,
        );

        isAuthorized =
          apiAccessControl?.[requestContext.apiKey]?.isEnabled ?? false;
      }
    } else {
      this.logger.debug(
        `${methodname} - API Access Control Suppressed`,
        requestContext,
      );
    }

    if (!isAuthorized) {
      this.logger.debug(
        `${methodname} - API Access Control Authorized: ${isAuthorized}`,
        requestContext,
      );
    }

    return isAuthorized;
  }

  protected async isAPIUserAuthorized(
    requestContext: RequestContext,
    context: ExecutionContext,
    api: ApiOptions,
    apiOperation: GraphQLOperationOptions | RestAPIOptions,
  ): Promise<boolean> {
    const methodname = `${AuthorizationGuard.name}.isAPIUserAuthorized`;

    let isAuthorized = true;

    const isAuthRequired = this.isAPIOperationAuthorizationRequired(
      requestContext,
      context,
      api,
      apiOperation,
    );

    if (isAuthRequired) {
      isAuthorized = await this.isUserAuthorized(requestContext, context);

      if (!isAuthorized) {
        throw new UnauthorizedException();
      }

      isAuthorized = this.isUserScopeAuthorized(
        requestContext,
        context,
        api,
        apiOperation,
      );
    }

    return isAuthorized;
  }

  /**
   * Implementations should override and perform the authorization check here specific to their requirements
   * @param requestContext
   * @param context
   * @returns
   */
  protected async isUserAuthorized(
    requestContext: RequestContext,
    context: ExecutionContext,
  ): Promise<boolean> {
    // return requestContext.user ? true : false;

    return true;
  }
  /**
   * Check if the operation is authorization required
   *
   * @TODO - Revisit the default service guard rule
   *
   * @param requestContext
   * @param context
   * @returns
   */
  protected isAPIOperationAuthorizationRequired(
    requestContext: RequestContext,
    context: ExecutionContext,
    api: ApiOptions,
    apiOperation: GraphQLOperationOptions | RestAPIOptions,
  ) {
    let { isAuthRequired } = apiOperation ?? {};

    if (isAuthRequired === undefined) {
      isAuthRequired = this.config.get<boolean>(
        AppConfigurationKeys.doAPIUserAuthorizationByDefault,
      );
    }

    return isAuthRequired;
  }

  protected isUserScopeAuthorized(
    requestContext: RequestContext,
    context: ExecutionContext,
    api: ApiOptions,
    apiOperation: GraphQLOperationOptions | RestAPIOptions,
  ): boolean {
    const methodname = `${AuthorizationGuard.name}.isUserScopeAuthorized`;

    let isAuthorized = true;

    const operationScope = this.getAPIOperationScope(
      requestContext,
      context,
      api,
      apiOperation,
    );

    if (operationScope?.length > 0) {
      isAuthorized = false;

      const userScope = this.getUserScope(requestContext, context);

      for (const scope of operationScope) {
        if (userScope.includes(scope)) {
          isAuthorized = true;
          break;
        }
      }
    }

    return isAuthorized;
  }

  protected getAPIOperationScope(
    requestContext: RequestContext,
    context: ExecutionContext,
    api: ApiOptions,
    apiOperation: GraphQLOperationOptions | RestAPIOptions,
  ): string[] {
    const { feature } = api ?? {};

    let { scope } = apiOperation ?? {};

    scope = scope?.length > 0 ? scope : [];

    if (feature) {
      //Check feature configuration if operation scope has been configured, override if so

      const featureOperationScope = this.getFeatureOperationScope(
        requestContext,
        context,
        feature,
        apiOperation,
      );

      scope = featureOperationScope ?? scope;
    }

    return scope;
  }

  protected getFeatureOperationScope(
    requestContext: RequestContext,
    context: ExecutionContext,
    feature: FeatureModuleData,
    apiOperation: GraphQLOperationOptions | RestAPIOptions,
  ): string[] {
    let featureOperationScope: string[];

    let { name: operationName, id: operationId } = apiOperation ?? {};

    //If operationId and operationName present, operationId takes precedence. Name is probably aligned to the graphql query/mutation name
    //and Controller Method name...which, when both controller and resolvers are present, can be different. OperationId shoudl be uniform
    //across both for the given functionality.
    operationId = StringUtility.isStringNotEmpty(operationId)
      ? operationId
      : operationName;

    if (StringUtility.isStringNotEmpty(operationId)) {
      const operationConfiguration = feature.configuration?.operations?.find(
        (operation) => operation.id === operationId,
      );

      if (operationConfiguration) {
        const { acp } = operationConfiguration;

        if (acp) {
          //If enabled is false, all scopes are allowed
          featureOperationScope = [];

          if (acp.enabled) {
            //This may be undefined, on purpose, to allow scopes defined in decorator to take effect
            featureOperationScope = acp.scope;
          }
        }
      }
    }

    return featureOperationScope;
  }

  protected getUserScope(
    requestContext: RequestContext,
    context: ExecutionContext,
  ): string[] {
    return ["scopeA"];
  }

  protected getRequestContext(context: ExecutionContext): RequestContext {
    let request = context.switchToHttp().getRequest();

    //context.switchToHttp().getRequest() is undefined for GraphQL services, grab request the hard way.
    if (context.getType<GqlContextType>() === "graphql") {
      request = context.getArgByIndex(2);
    }

    const requestContext: RequestContext = request.raw?.requestContext ?? {};

    return requestContext;
  }
}
