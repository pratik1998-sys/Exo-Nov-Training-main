import { ShopifyConsumerConfiguration, ShopifyConsumerConfigurationConfig } from "@plugin-shopify/common";

export interface ShopifyNavigationConsumerConfigurationConfig extends ShopifyConsumerConfigurationConfig {
    shopPath: string;
    categoryPath: string;
    blogPath: string;
    articlePath: string;
    doNavigationRegistry: boolean;
}

export interface ShopifyNavigationConsumerConfiguration extends ShopifyConsumerConfiguration {
    configuration: ShopifyNavigationConsumerConfigurationConfig;
}
