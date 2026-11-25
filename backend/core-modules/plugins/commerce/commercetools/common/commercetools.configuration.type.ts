import { PluginConsumerConfiguration, PluginConsumerConfigurationConfiguration } from "@configuration/types";

export interface ProductTag {
    id: string;
    attribute: string;
}

export interface CommercetoolsConsumerConfigurationConfig extends PluginConsumerConfigurationConfiguration {
    storeId: string;
    rootCategory: string;
    navigationDepthCategories: number;
    defaultCurrency: string;
    doDataErasureOnDelete: boolean;
    isLocaleAware: boolean;
    productFilterByStoreAttributeId: string;
    shoppingListName: string;
    productTags: ProductTag[];
    categoryImageField: string;
}

export interface CommercetoolsConsumerConfiguration extends PluginConsumerConfiguration {
    configuration: CommercetoolsConsumerConfigurationConfig;
}
