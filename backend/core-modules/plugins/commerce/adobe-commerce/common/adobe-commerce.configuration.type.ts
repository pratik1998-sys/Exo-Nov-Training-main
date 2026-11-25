import { PluginConsumerConfiguration, PluginConsumerConfigurationConfiguration } from "@configuration/types";


export interface AdobeCommerceLocaleConfig {
    storeId: string;
    rootCategory: string;
}

export interface AdobeCommerceConsumerConfigurationConfig extends PluginConsumerConfigurationConfiguration {
    accessTokenTTL: number;
    topCategoriesDepth: number;
    productRangeFacets: string[];
    productAttributes: string[];
    locales: Record<string, AdobeCommerceLocaleConfig>;
}

export interface AdobeCommerceConsumerConfiguration extends PluginConsumerConfiguration {
    configuration: AdobeCommerceConsumerConfigurationConfig;
}
