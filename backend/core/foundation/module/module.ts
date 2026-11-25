import { AppConfiguration } from "@configuration/types";
import { LoggerKey } from "@logger";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ModuleRef } from "@nestjs/core";
import { ComponentModuleData } from "@server/loader/types/loader.types";
import { StringUtility } from "@utilities";
import { ClassPath, ClassResolver } from "@utilities/class-resolver.utility";

export interface ComponentType {
  id: string;
  fileSuffix: string;
  tsFileSuffix: string;
  classNameSuffix?: string;
}

export abstract class BaseModule {
  protected static providers: any[] = [];
  protected static resolvers: any[] = [];
  protected static imports: any[] = [];
  protected static exports: any[] = [];
  protected static controllers: any[] = [];

  static adminModules: any[] = [];

  protected static fileName: string;

  private static readonly shortPathKey: string = "dist";

  /**
   *  Use the NestJS logger, as this is possibly being executed before the runtime logger has been initialized. NestJS
   *  has been configured to buffer logs on start up, and when complete, will stream to the runtime logger
   */
  static readonly logger = new Logger(BaseModule.name);

  static async forRootAsync(
    configuration: AppConfiguration,
    module: ComponentModuleData,
    moduleClass: any,
  ) {
    return await this.initializeModule(configuration, module, moduleClass);
  }

  static async initializeModule(
    configuration: AppConfiguration,
    module: ComponentModuleData,
    moduleClass: any,
  ): Promise<any> {
    throw new Error(
      `${BaseModule.name}.initializeModule - initializeModule() must be overwritten by child class`,
    );
  }

  protected static async importResolvedClass(
    classComponentIdPrefix: string,
    classNameSuffix: string,
    classPath: ClassPath,
    classFilePath?: string,
  ) {
    const methodname = `${BaseModule.name}.importResolvedClass`;

    classFilePath = classFilePath ?? classPath.resolvedPath;

    classPath.id = classPath.fileName
      .substring(classPath.fileName.lastIndexOf(classComponentIdPrefix))
      .replace(".js", "");

    const classDef = await import(classFilePath);

    const classDefKeys = Object.keys(classDef);

    let className = classDefKeys.length > 0 ? classDefKeys[0] : null;
    let matchingClassNames = className ? [className] : [];

    if (StringUtility.isStringNotEmpty(classNameSuffix)) {
      const suffixMatches = classDefKeys.filter((key) =>
        key.endsWith(classNameSuffix),
      );

      if (suffixMatches.length > 0) {
        className = suffixMatches[0];
        matchingClassNames = suffixMatches;
      } else {
        this.logger.log(
          `${methodname} - Warning: No exported class member found with classNameSuffix [${classNameSuffix}] in file [${classFilePath}] - Will use the first export [${className}]`,
        );
      }
    } else {
      this.logger.log(
        `${methodname} - Warning: No classNameSuffix provided to resolve the proper class export for file [${classFilePath}] - Will use the first export [${className}]`,
      );
    }

    matchingClassNames.forEach((key) => (classDef[key].id = classPath.id));

    //Don't override classObj if it exists (this would be the case if this was a force default class import possibly)
    classPath.classObj = classPath.classObj ?? classDef[className];

    //Collect every matching export (not just the first) so consumers that support multiple classes
    //per file (e.g. several entities exported from one *.entity.ts file) can use them all.
    classPath.classObjs = (classPath.classObjs ?? []).concat(
      matchingClassNames.map((key) => classDef[key]),
    );
  }

  protected static getModuleDirectoryShortPath(moduleClass: any) {
    const shortPath = moduleClass.fileName
      .substring(
        moduleClass.fileName.indexOf(this.shortPathKey) +
          this.shortPathKey.length,
      )
      .replace(".js", "");

    return shortPath;
  }

  protected static async importFullClassPathHierarchy(
    componentType: ComponentType,
    classPath: ClassPath,
    prefix: string,
  ) {
    const methodname = `${BaseModule.name}.importFullClassHierarchy`;

    this.logger.log(
      `${methodname} - Import full class hierarchy for class ${classPath.id}: ${JSON.stringify(classPath)}`,
    );

    const async = classPath.paths.map((path) => {
      return this.importClassPathClass(
        path.path,
        classPath,
        componentType,
        prefix,
      );
    });

    await Promise.all(async);
  }

  protected static async importClassPathClass(
    directory: string,
    classPath: ClassPath,
    componentType: ComponentType,
    prefix: string,
  ) {
    const methodname = `${BaseModule.name}.importClassPathClass`;

    if (StringUtility.isStringNotEmpty(directory)) {
      const { id } = classPath;

      this.logger.log(
        `${methodname} - Importing class path ${id} file: ${directory}`,
      );
      await this.importResolvedClass(
        prefix,
        componentType.classNameSuffix,
        classPath,
        directory,
      );
    }
  }

  protected static async resolveClass(
    configuration: AppConfiguration,
    classComponentIdPrefix: string,
    directory: string,
    fileFormat: string,
    isDirectoryStructureEnforced: boolean = false,
  ): Promise<ClassPath> {
    const methodname = `${BaseModule.name}.resolveClass`;

    const { appName } = configuration;

    const classPaths: ClassPath[] = await ClassResolver.resolveClassPaths(
      fileFormat,
      appName,
      directory,
      this.logger,
      false,
      !isDirectoryStructureEnforced ? directory : undefined,
    );

    const classPath = classPaths.length > 0 ? classPaths[0] : null;

    if (classPath) {
      await this.importResolvedClass(classComponentIdPrefix, null, classPath);
    } else {
      this.logger.log(
        `${methodname} - No class found in root directory ${directory} with file format ${fileFormat}`,
      );
    }

    return classPath;
  }

  protected static createClassProvider(
    token: any,
    configuration: AppConfiguration,
    classComponentIdPrefix: string,
    directory: string,
    fileFormat: string,
  ) {
    return {
      provide: token,
      useFactory: async (
        configService: ConfigService,
        moduleRef: ModuleRef,
        loggerKey,
      ) => {
        const classPath = await this.resolveClass(
          configuration,
          classComponentIdPrefix,
          directory,
          fileFormat,
        );

        return new classPath.classObj(configService, moduleRef, loggerKey);
      },
      inject: [ConfigService, ModuleRef, LoggerKey],
    };
  }
}
