import { AppConfigurationKeys } from "@configuration/app";
import { PluginConfiguration } from "@configuration/types";
import { RequestContext } from "@context/request";
import { ConfigService } from "@nestjs/config";
import { PluginModuleData } from "@server/loader/types/loader.types";

export class PluginUtility {
  static getPluginConsumerConfiguration<T>(
    requestContext: RequestContext,
    plugin: PluginModuleData,
    configService: ConfigService,
  ): T {
    const pluginConfiguration: PluginConfiguration =
      this.getPluginConfiguration(plugin, configService);

    return pluginConfiguration.configuredConsumers[
      requestContext.consumer
    ] as T;
  }

  static getPluginConfiguration<T>(
    plugin: PluginModuleData,
    configService: ConfigService,
  ): T {
    const featureConfig: Record<string, any> = configService.get(
      AppConfigurationKeys.configuredFeatures,
    );

    if (plugin.feature.group) {
      return (
        featureConfig[plugin.feature.group]?.configuredFeatures[
          plugin.feature.id
        ]?.configuredPlugins[plugin.id] ?? {}
      );
    } else {
      return (
        featureConfig[plugin.feature.id]?.configuredPlugins[plugin.id] ?? {}
      );
    }
  }

  static getFeatureConfiguration<T>(
    plugin: PluginModuleData,
    configService: ConfigService,
  ) {
    const featureConfig: Record<string, any> = configService.get(
      AppConfigurationKeys.configuredFeatures,
    );

    if (plugin.feature.group) {
      return featureConfig[plugin.feature.group].configuredFeatures[
        plugin.feature.id
      ].configuration;
    } else {
      return featureConfig[plugin.feature.id].configuration;
    }
  }
}
