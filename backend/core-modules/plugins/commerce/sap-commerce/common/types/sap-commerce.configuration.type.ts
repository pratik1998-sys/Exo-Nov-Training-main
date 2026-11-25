import { PluginConsumerConfiguration, PluginConsumerConfigurationConfiguration } from "@configuration/types";

export interface SAPCommerceConsumerConfigurationConfig extends PluginConsumerConfigurationConfiguration {
    storeId: string;
    catalog: string;
    catalogVersion: string;
    rootCategory: string;
    isB2B: boolean;
    countries: string[];
}

export interface SAPCommerceConsumerConfiguration extends PluginConsumerConfiguration {
    configuration: SAPCommerceConsumerConfigurationConfig;
}
