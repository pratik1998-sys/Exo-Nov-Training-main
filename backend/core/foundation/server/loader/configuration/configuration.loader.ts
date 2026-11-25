import * as path from "path";
import { readFileSync } from "fs";
import YAML from "yaml";
import { Logger } from "@nestjs/common";
import { merge } from "lodash";
import { Transport } from "@nestjs/microservices";
import {
  EnvironmentVariableKeys,
  EnvironmentVariableValues,
} from "@configuration/environment";
import {
  AppConfiguration,
  FeatureConfiguration,
  FeatureConfigurationMapValue,
  PluginConfiguration,
} from "@configuration/types";
import {
  AppConfigurationEntryConfig,
  AppConfigurationKeys,
  ConfigurationTypes,
} from "@configuration/app";
import { StringUtility } from "@utilities";
import { ConfigurationUtility } from "@configuration/utilities";

export class ConfigurationLoader {
  protected static readonly logger = new Logger(ConfigurationLoader.name);

  static loadConfiguration(
    appName: string,
    appDirectory: string,
    includeDisabledEntities: boolean = false,
  ) {
    const methodname = `${ConfigurationLoader.name}.loadConfiguration [${appName}]`;

    if (process.env[EnvironmentVariableKeys.loggerLevels]) {
      this.logger.localInstance.setLogLevels(
        JSON.parse(process.env[EnvironmentVariableKeys.loggerLevels]),
      );
    }

    const filePath = `${appDirectory}${path.sep}configuration.yaml`;

    //Don't let the library do the merge - for consistency of "configuration" field and the override/extend
    //capability, lodash merge(...) needs to be used instead, and want to keep uniformity of "configuration"
    //field name in the config yaml
    let configuration: AppConfiguration = YAML.parse(
      readFileSync(filePath, "utf8"),
      { merge: false },
    );

    //Disabling until ready to release
    // this.addGeneratorConfiguration(appName, configuration);

    this.primeConfiguration(appName, configuration);

    this.primeFeaturePluginConfiguration(
      appName,
      configuration,
      includeDisabledEntities,
    );

    // configuration.isSwaggerDisabled = ConfigurationUtility.parseBoolean(process.env[EnvironmentVariableKeys.disableOpenAPISwagger]);
    // configuration.isGraphqlPlaygroundDisabled = ConfigurationUtility.parseBoolean(process.env[EnvironmentVariableKeys.disableGraphqlPlayground]);
    // configuration.urlBasePath = process.env[EnvironmentVariableKeys.urlBasePath];

    this.processEnvironmentOverrides(configuration);

    this.logger.log(
      `${methodname} - Logger Masked Fields: ${JSON.stringify(configuration[AppConfigurationKeys.loggerMaskedFields])}`,
    );

    this.logger.log(
      `${methodname} - Loaded Configuration: ${JSON.stringify(configuration)}`,
    );

    configuration = {
      ...configuration,
      env: {
        ...process.env,
      },
    };

    this.primeAPIAuthorizationConfiguration(appName, configuration);

    return configuration;
  }

  protected static processEnvironmentOverrides(
    configuration: AppConfiguration,
  ) {
    const methodname = `${ConfigurationLoader.name}.processEnvironmentOverrides`;

    Object.entries(AppConfigurationEntryConfig).forEach(
      ([configurationKey, envVariableConfig]) => {
        const {
          id,
          environmentVariableKey,
          type,
          default: defaultValue,
        } = envVariableConfig;

        if (
          StringUtility.isStringNotEmpty(environmentVariableKey) &&
          process.env.hasOwnProperty(environmentVariableKey)
        ) {
          this.logger.log(
            `${methodname} - Processing environment override for configuration key: ${id} from environment variable: ${environmentVariableKey}`,
          );

          configuration[id] = process.env[environmentVariableKey];

          if (ConfigurationTypes.boolean === type) {
            configuration[id] = ConfigurationUtility.parseBoolean(
              configuration[id],
            );
          } else if (ConfigurationTypes.json === type) {
            configuration[id] = JSON.parse(configuration[id]);
          }
        }

        if (!configuration.hasOwnProperty(id) && defaultValue !== undefined) {
          configuration[id] = defaultValue;
        }
      },
    );
  }

  /**
   * The API Access Control flag can be defined both in an app's configuration.yaml and as an environment variable. Environment variable
   * takes precedence over the configuration.yaml value.
   * @param appName
   * @param configuration
   */
  protected static primeAPIAuthorizationConfiguration(
    appName: string,
    configuration: AppConfiguration,
  ) {
    if (configuration[AppConfigurationKeys.doAPIAccessControl]) {
      const apiAccessControl = configuration.env[
        EnvironmentVariableKeys.apiAccessControl
      ]
        ? JSON.parse(
            configuration.env[EnvironmentVariableKeys.apiAccessControl],
          )
        : [];

      configuration.apiAccessControl = {};

      apiAccessControl.forEach((accessControl) => {
        const apiKey = Buffer.from(
          `${accessControl.clientId}:${accessControl.clientSecret}`,
        ).toString("base64");

        const obj = {
          apiKey,
          clientId: accessControl.clientId,
          clientSecret: accessControl.clientSecret,
          scope: accessControl.scope ?? [],
          isEnabled: !accessControl.disabled,
        };

        configuration.apiAccessControl[accessControl.clientId] = obj;
        configuration.apiAccessControl[apiKey] = obj;
      });
    }
  }

  static primeFeaturePluginConfiguration(
    appName: string,
    configuration: AppConfiguration,
    ignoreDisabledFeatures: boolean,
  ) {
    const methodname = `${ConfigurationLoader.name}.primeFeaturePluginConfiguration [${appName}]`;

    const configuredPlugins: Record<string, PluginConfiguration> = {};
    configuration.configuredMessengers = {};

    const consumerMap = this.flattenConfigurationList(configuration.consumers);

    configuration.plugins.forEach((plugin) => {
      if (!plugin.consumers) {
        plugin.consumers = configuration.consumers;
      } else {
        //Merge the app level consumers into plugins
        plugin.consumers = Object.values(
          merge(
            {},
            consumerMap,
            this.flattenConfigurationList(plugin.consumers),
          ),
        );
      }

      plugin.consumers = plugin.consumers ?? configuration.consumers;

      this.processPluginConfiguration(configuration, plugin);

      configuredPlugins[plugin.id] = plugin;
    });

    if (configuration.messengers) {
      configuration.messengers.forEach((messenger) => {
        messenger.configuredTopics = this.flattenConfigurationList(
          messenger.topics ?? [],
        );

        configuration.configuredMessengers[messenger.id] = messenger;
      });
    }

    configuration.configuredFeatures = {};
    configuration.configuredAdminFeatures = {};
    configuration.configuredSetupFeatures = {};

    this.primeFeatureConfigurations(
      appName,
      configuredPlugins,
      configuration,
      ignoreDisabledFeatures,
      configuration.features,
      configuration.configuredFeatures,
    );
    this.primeFeatureConfigurations(
      appName,
      configuredPlugins,
      configuration,
      ignoreDisabledFeatures,
      configuration.adminFeatures,
      configuration.configuredAdminFeatures,
    );
    // this.primeFeatureConfigurations(appName, configuredPlugins, configuration, ignoreDisabledFeatures, configuration.setupFeatures, configuration.configuredSetupFeatures);

    // delete configuration.features;
    // delete configuration.adminFeatures;
    // delete configuration.setupFeatures;
    //delete configuration.plugins;

    process.env[EnvironmentVariableKeys.messengers] = JSON.stringify(
      configuration.configuredMessengers,
    );
  }

  protected static addGeneratorConfiguration(
    appName: string,
    configuration: AppConfiguration,
  ) {
    const methodname = `${ConfigurationLoader.name}.addGeneratorConfiguration [${appName}]`;

    if (
      EnvironmentVariableValues.appNodeEnv.local ==
      process.env[EnvironmentVariableKeys.appNodeEnv]
    ) {
      configuration.plugins.push({
        id: "generator",
      });

      configuration.features.push({
        group: "generator",
        features: [
          {
            enabled: true,
            id: "generator-app",
            plugin: {
              id: "generator",
            },
          },
          {
            enabled: true,
            id: "generator-feature",
            plugin: {
              id: "generator",
            },
          },
          {
            enabled: true,
            id: "generator-plugin",
            plugin: {
              id: "generator",
            },
          },
          {
            enabled: true,
            id: "generator-directory",
            plugin: {
              id: "generator",
            },
          },
        ],
      });
    }
  }

  protected static primeConfiguration(
    appName: string,
    configuration: AppConfiguration,
  ) {
    const methodname = `${ConfigurationLoader.name}.primeConfiguration [${appName}]`;

    configuration.appName = configuration.appName ?? appName;

    //Add message configuration to process.env from the app config.yaml, as ConfigService
    //is not usable in decorators
    if (configuration.messengers) {
      configuration.messengers.forEach((messenger: any) => {
        messenger.transport = Transport[messenger.type.toUpperCase()];
      });
    }

    configuration.isAdminAppEnabled = true;

    //Override the admin app enablement if the environment has disable set to true
    if (
      ConfigurationUtility.parseBoolean(
        process.env[EnvironmentVariableKeys.disableAdminApp],
      )
    ) {
      this.logger.log(
        `${methodname} - Overriding admin app enablement in configuration from environment variables`,
      );

      configuration.isAdminAppEnabled = false;
    }

    configuration.defaultConsumerId = "default";
    configuration.consumerIds = [];

    if (configuration.consumers) {
      configuration.consumers.forEach((consumer) => {
        if (consumer.enabled) {
          configuration.consumerIds.push(consumer.id);
        }

        if (consumer.default) {
          configuration.defaultConsumerId = consumer.id;
        }
      });
    }

    if (configuration.locales) {
      configuration.defaulteLocale =
        ConfigurationUtility.getConfigurationValueListDefaultId(
          configuration,
          AppConfigurationKeys.locales,
          null,
        );
    }

    if (!configuration.loggerMaskedFields) {
      configuration.loggerMaskedFields = [];
    }
  }

  protected static primeFeatureConfigurations(
    appName: string,
    configuredPlugins: Record<string, PluginConfiguration>,
    configuration: AppConfiguration,
    ignoreDisabledFeatures: boolean,
    features: FeatureConfiguration[],
    featureMap: Record<string, FeatureConfigurationMapValue>,
    featureGroup?: FeatureConfigurationMapValue,
  ) {
    const methodname = `${ConfigurationLoader.name}.primeFeatureConfigurations [${appName}]`;

    features.forEach((feature) => {
      if (feature.features) {
        this.logger.log(
          `${methodname} - Processing feature configurations for feature group: ${feature.id}`,
        );

        featureMap[feature.id] = {
          id: feature.id,
          isGroup: true,
          configuredFeatures: {},
        };

        return this.primeFeatureConfigurations(
          appName,
          configuredPlugins,
          configuration,
          ignoreDisabledFeatures,
          feature.features,
          featureMap[feature.id].configuredFeatures,
          feature,
        );
      } else if (
        feature.enabled ||
        !feature.hasOwnProperty("enabled") ||
        ignoreDisabledFeatures
      ) {
        const { id: featureId } = feature;

        feature.group = featureGroup?.id;
        feature.configuration = merge(
          {},
          featureGroup?.configuration ?? {},
          feature.configuration,
        );

        feature.configuredPlugins = {};
        feature.configuredMessages = {};
        feature.configuredSubscriptions = {};

        if (!feature.standalone && (feature.plugin || feature.plugins)) {
          const boundPluginIds: string[] = [];
          const boundConsumerIds: string[] = [];

          if (feature.plugin) {
            feature.plugins = [feature.plugin];
            delete feature.plugin;
          }

          const isMultiPluginFeature = feature.plugins.length > 1;

          feature.plugins.forEach((plugin) => {
            plugin = JSON.parse(JSON.stringify(plugin));

            const { id: pluginId } = plugin;

            if (!boundPluginIds.includes(pluginId)) {
              boundPluginIds.push(pluginId);

              const globalPlugin = configuredPlugins[pluginId];

              this.processPluginConfiguration(configuration, plugin);

              plugin.type = globalPlugin.type;
              plugin.name = globalPlugin.name;
              plugin.tokenId = globalPlugin.tokenId;

              plugin.middleware = merge(
                [],
                globalPlugin.middleware ?? [],
                plugin.middleware ?? [],
              );

              plugin.configuration = merge(
                {},
                globalPlugin.configuration,
                plugin.configuration,
              );
              plugin.configuredVariants = merge(
                {},
                globalPlugin.configuredVariants,
                plugin.configuredVariants,
              );

              if (globalPlugin.databases?.length > 0) {
                this.logger.log(
                  `${methodname} - Plugin [${pluginId}] is backed by database`,
                );
                plugin.databases = merge(
                  [],
                  globalPlugin.databases,
                  plugin.databases ?? [],
                );
                plugin.configuredDatabases = this.flattenConfigurationList(
                  plugin.databases,
                );
              }

              if (isMultiPluginFeature) {
                const pluginConsumerIds = Object.keys(
                  plugin.configuredConsumers,
                );

                if (pluginConsumerIds.length > 0) {
                  //Selective merge as the associated consumers for this plugin is defined here, and not just an override capability
                  pluginConsumerIds.forEach((consumerId) => {
                    plugin.configuredConsumers[consumerId] = merge(
                      {},
                      globalPlugin.configuredConsumers[consumerId],
                      plugin.configuredConsumers[consumerId],
                    );
                  });
                } else {
                  this.logger.log(
                    `${methodname} - Warning: Multiple plugins defined for feature [${featureId}], No consumers defined for plugin [${pluginId}]`,
                  );
                }
              } else {
                //Can do a blind merge here as it's only one plugin defined for the feature, and thus all consumers should be associated
                plugin.configuredConsumers = merge(
                  {},
                  globalPlugin.configuredConsumers,
                  plugin.configuredConsumers,
                );
              }

              Object.values(plugin.configuredVariants).forEach((variant) => {
                if (!globalPlugin.configuredVariants[variant.id]) {
                  this.logger.log(
                    `${methodname} - WARNING - Plugin [${pluginId}] has improper variant configuration override [${variant.id}] - Must be in within ${JSON.stringify(Object.keys(globalPlugin.configuredVariants))}`,
                  );
                }

                variant.configuration = merge(
                  {},
                  plugin.configuration,
                  variant.configuration,
                );
              });

              Object.values(plugin.configuredConsumers).forEach((consumer) => {
                const { id: consumerId, variantId } = consumer;

                if (!boundConsumerIds.includes(consumerId)) {
                  boundConsumerIds.push(consumerId);

                  if (!configuration.consumerIds.includes(consumerId)) {
                    this.logger.log(
                      `${methodname} - Plugin [${pluginId}] configured with improper consumer [${consumerId}] - Must be one of: ${JSON.stringify(configuration.consumerIds)}`,
                    );
                    throw new Error(
                      `FEATURE_PLUGIN_CONSUMER_ID_INVALID:${featureId}:${pluginId}:${consumerId}`,
                    );
                  }

                  if (
                    variantId &&
                    !globalPlugin.configuredVariants[variantId]
                  ) {
                    this.logger.log(
                      `${methodname} - Feature[${featureId}] Plugin [${pluginId}] has invalid variant defined: ${variantId} - Must be one of ${JSON.stringify(Object.keys(globalPlugin.variants))}`,
                    );
                    throw new Error(
                      `FEATURE_PLUGIN_VARIANT_INVALID:${featureId}:${pluginId}:${variantId}`,
                    );
                  }

                  let consumerBaseConfiguration = plugin.configuration;

                  if (
                    variantId &&
                    plugin.configuredVariants[variantId]?.configuration
                  ) {
                    consumerBaseConfiguration =
                      plugin.configuredVariants[variantId].configuration;
                  }

                  consumer.configuration = merge(
                    {},
                    consumerBaseConfiguration,
                    consumer.configuration,
                  );
                } else {
                  this.logger.log(
                    `${methodname} - Feature[${featureId}] has a plugin consumerId conflict for consumerId ${consumerId}`,
                  );
                  throw new Error(
                    `FEATURE_PLUGIN_CONSUMER_ID_CONFLICT:${featureId}:${pluginId}:${consumerId}`,
                  );
                }
              });

              delete plugin.configuration;
              delete plugin.variants;
              delete plugin.consumers;

              feature.configuredPlugins[pluginId] = plugin;
            } else {
              this.logger.log(
                `${methodname} - Feature[${featureId}] has a plugin conflict for plugin ${pluginId}`,
              );
              throw new Error(
                `FEATURE_PLUGIN_CONFLICT:${featureId}:${pluginId}`,
              );
            }
          });
        }

        if (feature.messengers) {
          feature.messengers.forEach((messenger) => {
            const { id: messengerId } = messenger;

            if (!feature.configuredMessengers[messengerId]) {
              const globalMessenger =
                configuration.configuredMessengers[messengerId];

              messenger.configuredTopics = this.flattenConfigurationList(
                messenger.topics,
              );

              if (globalMessenger) {
                feature.configuredMessengers[messengerId] = merge(
                  {},
                  globalMessenger,
                  messenger,
                );
              } else {
                this.logger.log(
                  `${methodname} - Feature[${featureId}] messenger not found: ${messengerId}`,
                );
                throw new Error(
                  `FEATURE_MESSENGER_NOT_FOUND:${featureId}:${messengerId}`,
                );
              }
            } else {
              this.logger.log(
                `${methodname} - Feature[${featureId}] has a messenger conflict for messenger ${messengerId}`,
              );
              throw new Error(
                `FEATURE_MESSENGER_CONFLICT:${featureId}:${messengerId}`,
              );
            }
          });
        }

        if (feature.subscriptions) {
          feature.subscriptions.forEach((subscription) => {
            const { id: subscriptionId, messenger, topic } = subscription;

            if (!feature.configuredSubscriptions[subscriptionId]) {
              const featureMessenger =
                feature.configuredMessengers[messenger.id];

              if (featureMessenger) {
                const featureMessengerTopic =
                  featureMessenger.configuredTopics[topic.id];

                if (featureMessengerTopic) {
                  subscription.messenger = merge(
                    {},
                    featureMessenger,
                    messenger,
                  );
                  subscription.topic = merge({}, featureMessengerTopic, topic);

                  feature.configuredSubscriptions[subscriptionId] =
                    subscription;
                } else {
                  this.logger.log(
                    `${methodname} - Feature[${featureId}] Subscription [${subscriptionId}] Messenger [${messenger.id}] Topic not associated: ${topic.id}`,
                  );
                  throw new Error(
                    `FEATURE_SUBSCRIPTION_MESSENGER_TOPIC:NOT_ASSOCIATED:${featureId}:${subscriptionId}:${messenger.id}:${topic.id}`,
                  );
                }
              } else {
                this.logger.log(
                  `${methodname} - Feature[${featureId}] Subscription [${subscriptionId}] messenger not associated: ${messenger.id}`,
                );
                throw new Error(
                  `FEATURE_SUBSCRIPTION_MESSENGER_NOT_ASSOCIATED:${featureId}:${subscriptionId}:${messenger.id}`,
                );
              }
            } else {
              this.logger.log(
                `${methodname} - Feature[${featureId}] has a subscription conflict for subscription ${subscriptionId}`,
              );
              throw new Error(
                `FEATURE_SUBSCRIPTION_CONFLICT:${featureId}:${subscriptionId}`,
              );
            }
          });
        }

        featureMap[featureId] = feature;
        featureMap[featureId].isGroup = false;

        delete feature.plugins;
      } else {
        this.logger.log(`${methodname} - Feature [${feature.id}] Disabled`);
      }
    });
  }

  protected static processPluginConfiguration(
    configuration: AppConfiguration,
    plugin: PluginConfiguration,
  ) {
    plugin.configuration = plugin.configuration ?? {};

    plugin.configuredVariants = this.flattenConfigurationList(
      plugin.variants ?? [],
    );
    plugin.configuredConsumers = this.flattenConfigurationList(
      plugin.consumers,
    );
    plugin.configuredDatabases = this.flattenConfigurationList(
      plugin.databases ?? [],
    );

    if (plugin.variants) {
      plugin.variants.forEach((variant) => {
        variant.consumerIds.forEach((consumerId) => {
          plugin.configuredConsumers[consumerId].variantId = variant.id;
        });
      });
    }

    if (plugin.loggerMaskedFields) {
      plugin.loggerMaskedFields.forEach((field) => {
        if (!configuration.loggerMaskedFields.includes(field)) {
          configuration.loggerMaskedFields.push(field);
        }
      });
    }
  }

  protected static flattenConfigurationList(list: any[], key: string = "id") {
    const map: Record<string, any> = {};

    if (list) {
      list.forEach((obj) => {
        map[obj[key]] = obj;
      });
    }

    return map;
  }
}
