import {
  FeatureConfiguration,
  PluginConfiguration,
} from "@configuration/types";
import { ModuleMetadata, Provider } from "@nestjs/common";
import { PluginComponentVariant } from "@plugin/module";
import { ClassPath } from "@utilities/class-resolver.utility";

export enum ModuleType {
  admin = "ADMIN",
  feature = "FEATURE",
  plugin = "PLUGIN",
  logger = "LOGGER",
  guard = "GUARD",
  registry = "REGISTRY",
  messenger = "MESSENGER",
}

export interface ApplicationModuleData extends ModuleMetadata {
  appId: string;
  appDirectoryRoot: string;
  module: any;
  featureModules: FeatureModuleData[];
  moduleNames: string[];
  adminProviders: Provider[];
  messageIds: string[];
}

export interface ComponentModuleData {
  id: string;
  configuration?: any;
  classFileFormat: string;
  type?: ModuleType;
  classPath: ClassPath;
  importedModule: any;
}

export interface PluginModuleData extends ComponentModuleData {
  feature: {
    id: string;
    group: string;
  };
  configuration: PluginConfiguration;
  serviceVariants?: PluginComponentVariant[];
  datasourceVariants?: PluginComponentVariant[];
  mapperVariants?: PluginComponentVariant[];
  registryVariants?: PluginComponentVariant[];
  consumerPluginComponents?: {
    [key: string]: {
      variant: string;
      services: ClassPath[];
      datasources: ClassPath[];
      mappers: ClassPath[];
      registries: ClassPath[];
    };
  };
}

export class FeatureModuleData implements ComponentModuleData {
  id: string;
  configuration: FeatureConfiguration;
  classFileFormat: string;
  type?: ModuleType;
  classPath: ClassPath;
  importedModule: any;
  group: string;
  pluginModules: PluginModuleData[];
  isStandalone: boolean;
  resolverClassPaths?: ClassPath[];
  controllerClassPaths?: ClassPath[];
}
