import { AppConfiguration } from "@configuration/types";
import { ComponentType } from "@module";
import { Provider } from "@nestjs/common";
import { BasePluginModule, PluginComponentVariant } from "@plugin/module";
import { PluginModuleData } from "@server/loader/types/loader.types";

export class BaseAdminPluginModule extends BasePluginModule {
  /**
   * Admin plugin entities do not have the concept of consumers, thus, override this method to avoid consumerId processing
   *
   * @param config
   * @param resolvedClassPaths
   * @param featureId
   * @param pluginId
   * @param componentType
   * @param pluginConfig
   * @returns
   */
  protected static buildPluginComponentProviders(
    configuration: AppConfiguration,
    plugin: PluginModuleData,
    componentType: ComponentType,
    resolvedPluginComponentVariants: PluginComponentVariant[],
  ): Provider[] {
    const methodname = this.composeMethodName(
      "buildPluginComponentProviders",
      plugin,
    );

    const resolvedProviders: Provider[] = [];

    this.addVariantsToPluginData(
      plugin,
      componentType,
      resolvedPluginComponentVariants,
    );

    for (const resolvedPluginComponentVariant of resolvedPluginComponentVariants) {
      const { classPaths } = resolvedPluginComponentVariant;

      for (const classPath of classPaths) {
        const { id } = classPath;

        resolvedProviders.push(
          this.buildConsumerPluginComponentProvider(
            configuration,
            plugin,
            componentType,
            id,
            null,
            classPath,
          ),
        );
      }
    }

    return resolvedProviders;
  }
}
