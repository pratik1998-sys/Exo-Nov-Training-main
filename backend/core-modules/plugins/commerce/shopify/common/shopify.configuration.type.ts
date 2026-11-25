import { PluginConsumerConfiguration, PluginConsumerConfigurationConfiguration } from "@configuration/types";
import { GraphQLDatasourceConfig } from "@plugin-datasource-graphql";

export interface ShopifyMenuConfiguration {
    id: string;
    depth: number;
}

export interface ShopifyConsumerConfigurationConfig extends PluginConsumerConfigurationConfiguration {
    apiVersion: string;

    menus: {
        header: ShopifyMenuConfiguration;
        headerQuick: ShopifyMenuConfiguration;
        footer: ShopifyMenuConfiguration;
        footerQuick: ShopifyMenuConfiguration;
        rootCategory: ShopifyMenuConfiguration;
    };
}

export interface ShopifyConsumerConfiguration extends PluginConsumerConfiguration {
    configuration: ShopifyConsumerConfigurationConfig;
}

export interface ShopifyDatasourceConfiguration extends GraphQLDatasourceConfig { }
