export interface EnvironmentVariableKeysType {
  appNodeEnv: string;
  host: string;
  port: string;
  adminPort: string;
  graphqlDebug: string;
  disableGraphqlPlayground: string;
  disableOpenAPISwagger: string;
  disableAdminApp: string;
  serviceLogging: string;
  mapperLogging: string;
  messengerLogging: string;
  registryConfig: string;
  accessLogging: string;
  messengers: string;
  urlBasePath: string;
  apiAccessControl: string;
  loggerLevels: string;
  generatorOverrideDirectorySuppression: string;
  doAPIAccessControl: string;
}

export const EnvironmentVariableKeys: EnvironmentVariableKeysType = {
  appNodeEnv: "APP_ENV",
  host: "HOST",
  port: "PORT",
  adminPort: "ADMIN_PORT",
  graphqlDebug: "GRAPHQL_DEBUG",
  disableGraphqlPlayground: "DISABLE_GRAPHQL_PLAYGROUND",
  disableOpenAPISwagger: "DISABLE_OPENAPI_SWAGGER",
  disableAdminApp: "DISABLE_ADMIN_APP",
  serviceLogging: "SERVICE_LOGGING",
  mapperLogging: "MAPPER_LOGGING",
  messengerLogging: "MESSENGER_LOGGING",
  registryConfig: "REGISTRY_CONFIG",
  accessLogging: "ACCESS_LOGGING",
  messengers: "MESSENGERS",
  urlBasePath: "URL_BASE_PATH",
  apiAccessControl: "API_ACCESS_CONTROL",
  loggerLevels: "LOGGER_LEVELS",
  generatorOverrideDirectorySuppression:
    "GENERATOR_OVERRIDE_DIRECTORY_SUPPRESSION",
  doAPIAccessControl: "API_ACCESS_CONTROL_ENABLED",
};

export const EnvironmentVariableValues = {
  appNodeEnv: {
    local: "local",
    dev: "dev",
    qa: "qa",
    stage: "stage",
    prod: "prod",
  },
};
