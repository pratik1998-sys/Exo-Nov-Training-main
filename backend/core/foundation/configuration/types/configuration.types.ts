import { RouteInfo } from "@nestjs/common/interfaces/middleware/middleware-configuration.interface";
import { Transport } from "@nestjs/microservices";

export interface LocalesConfiguration {
  id: string;
  default: boolean;
}

export interface BaseConfiguration {
  id?: string;
  configuration?: Record<string, any>;
}

export interface DatastoreConfiguration extends BaseConfiguration {
  type: string;
  clientId?: string;
  enabled?: boolean;
  defaultLogLevel?: string;
}

export interface MessengerTopicConfig extends BaseConfiguration {
  topic: string;
}

export interface SubscriptionConfiguration extends BaseConfiguration {
  queries: string[];
  messenger: MessengerConfiguration;
  topic: MessengerTopicConfig;
}

export interface DatabaseConfiguration extends DatastoreConfiguration {}

export interface PluginDatabaseReference extends DatabaseConfiguration {
  primary?: boolean;
  consumers?: ConsumerConfiguration[];
}

export interface MessengerConfiguration extends DatastoreConfiguration {
  transport?: Transport;
  topics?: MessengerTopicConfig[];
  configuredTopics?: Record<string, MessengerTopicConfig>;
}

export interface PluginVariantConfiguration extends BaseConfiguration {
  consumerIds?: string[];
}
export interface ConsumerConfiguration extends BaseConfiguration {
  enabled: boolean;
  default: boolean;
}

export interface PluginConsumerConfiguration extends ConsumerConfiguration {
  variantId?: string;
  configuration?: PluginConsumerConfigurationConfiguration;
  pluginDefaultConsumer?: boolean;
  [key: string]: any;
}

export interface PluginPaginationConfiguration {
  pageSize: {
    default: number;
    max: number;
  };
}

export interface PluginConsumerConfigurationConfiguration {
  pagination?: PluginPaginationConfiguration;
  headers?: Record<string, string>;
  tokenId?: string;
  [key: string]: any;
}

export interface PluginConfiguration extends BaseConfiguration {
  variants?: PluginVariantConfiguration[];
  consumers?: PluginConsumerConfiguration[];
  loggerMaskedFields?: string[];
  name?: string;
  type?: string;
  vendor?: string;
  integrationType?: string;
  classNameToken?: string;
  configuredVariants?: {
    [key: string]: PluginVariantConfiguration;
  };
  configuredConsumers?: {
    [key: string]: PluginConsumerConfiguration;
  };
  databases?: PluginDatabaseReference[];
  configuredDatabases?: {
    [key: string]: PluginDatabaseReference;
  };
  middleware?: MiddlewareConfiguration[];
  [key: string]: any;
}

export interface FeatureConfiguration extends BaseConfiguration {
  group?: string;
  features?: FeatureConfiguration[];
  enabled?: boolean;
  standalone?: boolean;
  classNameToken?: string;
  plugin?: PluginConfiguration;
  plugins?: PluginConfiguration[];
  configuredPlugins?: Record<string, PluginConfiguration>;
  subscriptions?: SubscriptionConfiguration[];
  configuredSubscriptions?: Record<string, SubscriptionConfiguration>;
  messengers?: MessengerConfiguration[];
  configuredMessengers?: Record<string, MessengerConfiguration>;
  middleware?: MiddlewareConfiguration[];
  operations?: FeatureOperationConfiguration[];
  [key: string]: any;
}

export interface FeatureOperationConfiguration {
  id: string;
  description?: string;
  summary?: string;
  acp: FeatureOperationACPConfiguration;
}

export interface FeatureOperationACPConfiguration {
  enabled: boolean;
  scope: string[];
}

export interface FeatureConfigurationMapValue extends FeatureConfiguration {
  isGroup?: boolean;
  configuredFeatures?: Record<string, FeatureConfigurationMapValue>;
  // feature?: FeatureConfiguration;
}

export interface APIAccessControl {
  apiKey: string;
  clientId: string;
  clientSecret: string;
  scope: string[];
  isEnabled: boolean;
}

export interface MiddlewareConfigurationConfig {
  [key: string]: any;
}

export interface MiddlewareConsumerType {
  id: string;
  configuration?: MiddlewareConfigurationConfig;
}

export interface MiddlewareConfiguration {
  id: string;
  enabled: boolean;
  sequence: number;
  consumers?: MiddlewareConsumerType[];
  configuration?: MiddlewareConfigurationConfig;
  configuredConsumers?: Record<string, MiddlewareConsumerType>;
  excludeRoutes: (string | RouteInfo)[];
  forRoutes: (string | RouteInfo)[];
}

export interface AppConfiguration {
  appName: string;
  swaggerPath: string;
  graphqlPath: string;
  urlBasePath: string;
  fastifyBodyLimit?: number;
  doAPIUserAuthorizationByDefault: boolean;
  doAPIAccessControl: boolean;
  isAdminAppEnabled: boolean;
  moduleDirectories: string[];
  cors: Record<string, any>;
  appBootDebug: {
    logEntities: boolean;
    logMemory: boolean;
    logSerializedGraph: boolean;
  };
  logger: string;
  loggerMaskedFields: string[];
  locales: LocalesConfiguration[];
  consumers: ConsumerConfiguration[];
  databases: DatabaseConfiguration[];
  messengers: MessengerConfiguration[];
  configuredMessengers: Record<string, MessengerConfiguration>;
  plugins: PluginConfiguration[];
  features: FeatureConfiguration[];
  configuredFeatures: Record<string, FeatureConfigurationMapValue>;
  adminFeatures: FeatureConfiguration[];
  configuredAdminFeatures: Record<string, FeatureConfigurationMapValue>;
  setupFeatures: FeatureConfiguration[];
  configuredSetupFeatures: Record<string, FeatureConfigurationMapValue>;
  isSwaggerDisabled: boolean;
  isGraphqlPlaygroundDisabled: boolean;
  defaultConsumerId: string;
  defaulteLocale: string;
  consumerIds: string[];
  apiAccessControl: Record<string, APIAccessControl>;
  middleware?: MiddlewareConfiguration[];
  env: {
    [key: string]: string;
  };
}
