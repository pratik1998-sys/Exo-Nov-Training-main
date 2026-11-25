import { PluginConsumerConfiguration, PluginConsumerConfigurationConfiguration } from "@configuration/types";

export interface TutorialPetRestConsumerConfigurationConfig extends PluginConsumerConfigurationConfiguration {
    protocol: string;
}

export interface TutorialPetRestConsumerConfiguration extends PluginConsumerConfiguration {
    configuration: TutorialPetRestConsumerConfigurationConfig;
}
