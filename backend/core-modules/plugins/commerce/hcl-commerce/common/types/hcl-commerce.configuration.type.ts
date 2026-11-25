import { PluginConsumerConfiguration, PluginConsumerConfigurationConfiguration } from "@configuration/types";

export interface HCLCommerceConsumerConfigurationConfig extends PluginConsumerConfigurationConfiguration {
    languageIds: string[];
    accessTokenTTL: number;
    shoppingListName: string;
}

export interface HCLCommerceConsumerConfiguration extends PluginConsumerConfiguration {
    configuration: HCLCommerceConsumerConfigurationConfig;
}
