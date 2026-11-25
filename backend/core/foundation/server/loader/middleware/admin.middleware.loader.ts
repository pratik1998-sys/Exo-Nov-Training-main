import { MiddlewareConfiguration } from "@configuration/types";
import { ComponentType } from "@module/module";
import { ConfigService } from "@nestjs/config";
import {
  MiddlewareClassPath,
  MiddlewareLoader,
} from "@server/loader/middleware/middleware.loader";

export class AdminMiddlewareLoader extends MiddlewareLoader {
  protected static readonly middlewareComponentType: ComponentType = {
    id: "middleware",
    classNameSuffix: "Middleware",
    fileSuffix: "admin.middleware.js",
    tsFileSuffix: "admin.middleware.ts",
  };

  protected static readonly coreMiddleware: MiddlewareConfiguration[] = [
    {
      id: "request.context.admin.middleware",
      enabled: true,
      sequence: 1,
      configuration: {},
      forRoutes: [],
      excludeRoutes: [],
    },
  ];

  protected static isMiddlewareValid(
    appId: string,
    middlewareConfiguration: MiddlewareConfiguration,
  ) {
    return this.isMiddlewareEnabled(appId, middlewareConfiguration);
  }

  protected static async resolveMiddlewareClassPaths(
    appId: string,
    appDirectory: string,
    configService: ConfigService,
  ): Promise<MiddlewareClassPath[]> {
    const resolvedClassPaths: MiddlewareClassPath[] =
      await super.resolveMiddlewareClassPaths(
        appId,
        appDirectory,
        configService,
      );

    resolvedClassPaths.forEach(
      (resolvedClassPath) =>
        (resolvedClassPath.classDef.isAdminMiddleware = true),
    );

    return resolvedClassPaths;
  }
}
