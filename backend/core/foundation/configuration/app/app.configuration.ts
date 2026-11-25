import { EnvironmentVariableKeys } from "@configuration/environment";

export interface EnvironmentOverrideVariableConfig {
  id: string;
  type: string;
  environmentVariableKey?: string;
  default?: string | boolean | number | Record<string, any>;
}

export const ConfigurationTypes: Record<string, string> = {
  boolean: "boolean",
  string: "string",
  number: "number",
  json: "json",
};

export const AppConfigurationKeys = {
  ...EnvironmentVariableKeys,
  appName: "appName",
  doAPIUserAuthorizationByDefault: "doAPIUserAuthorizationByDefault",
  doAPIAccessControl: "doAPIAccessControl",
  consumers: "consumers",
  swaggerPath: "swaggerPath",
  graphqlPath: "graphqlPath",
  defaultLanguage: "defaultLanguage",
  defaultLocale: "defaultLocale",
  defaultConsumerId: "defaultConsumerId",
  consumerIds: "consumerIds",
  locales: "locales",
  databases: "databases",
  features: "features",
  configuredFeatures: "configuredFeatures",
  adminFeatures: "adminFeatures",
  configuredAdminFeatures: "configuredAdminFeatures",
  setupFeatures: "setupFeatures",
  configuredSetupFeatures: "configuredSetupFeatures",
  logger: "logger",
  loggerMaskedFields: "loggerMaskedFields",
  messages: "messages",
  requiredDatasourceConfiguration: "requiredDatasourceConfiguration",
  plugins: "plugins",
  apiAccessControl: "apiAccessControl",
  middleware: "middleware",
  isSwaggerDisabled: "isSwaggerDisabled",
  isGraphqlPlaygroundDisabled: "isGraphqlPlaygroundDisabled",
  urlBasePath: "urlBasePath",
};

export const AppConfigurationValues = {
  database: {
    types: {
      postgres: "postgres",
    },
  },
  messenger: {
    types: {
      apollo: "apollo",
    },
  },
  logger: {
    winston: "winston",
  },
};

export const AppConfigurationEntryConfig: Record<
  string,
  EnvironmentOverrideVariableConfig
> = {
  [AppConfigurationKeys.doAPIAccessControl]: {
    id: AppConfigurationKeys.doAPIAccessControl,
    environmentVariableKey: EnvironmentVariableKeys.doAPIAccessControl,
    type: ConfigurationTypes.boolean,
    default: false,
  },
  [AppConfigurationKeys.isSwaggerDisabled]: {
    id: AppConfigurationKeys.isSwaggerDisabled,
    environmentVariableKey: EnvironmentVariableKeys.disableOpenAPISwagger,
    type: ConfigurationTypes.boolean,
    default: false,
  },
  [AppConfigurationKeys.isGraphqlPlaygroundDisabled]: {
    id: AppConfigurationKeys.isGraphqlPlaygroundDisabled,
    environmentVariableKey: EnvironmentVariableKeys.disableGraphqlPlayground,
    type: ConfigurationTypes.boolean,
    default: false,
  },
  [AppConfigurationKeys.urlBasePath]: {
    id: AppConfigurationKeys.urlBasePath,
    environmentVariableKey: EnvironmentVariableKeys.urlBasePath,
    type: ConfigurationTypes.string,
    default: "",
  },
};
