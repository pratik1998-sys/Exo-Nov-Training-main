import { PluginPaginationConfiguration } from "@configuration/types";
import { ShopifyConsumerConfiguration, ShopifyConsumerConfigurationConfig } from "@plugin-shopify/common";

export interface ShopifyECUserConsumerConfigurationConfig extends ShopifyConsumerConfigurationConfig {
    addressPagination: PluginPaginationConfiguration;
}

export interface ShopifyNavigationConsumerConfiguration extends ShopifyConsumerConfiguration {
    configuration: ShopifyECUserConsumerConfigurationConfig;
}
