import { PluginConsumerConfiguration } from "@configuration/types";
import { CommercetoolsConsumerConfigurationConfig } from "@plugin-commercetools/common";

export interface CommercetoolsQuoteConsumerConfigurationConfig extends CommercetoolsConsumerConfigurationConfig {
    doFetchProduct: boolean;
}

export interface CommercetoolsQuoteConsumerConfiguration extends PluginConsumerConfiguration {
    configuration: CommercetoolsQuoteConsumerConfigurationConfig;
}
