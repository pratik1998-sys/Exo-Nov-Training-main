import { CommercetoolsQuoteConsumerConfiguration, CommercetoolsQuoteConsumerConfigurationConfig } from "@plugin-commercetools/features/quote";

export interface CommercetoolsOrderConsumerConfigurationConfig extends CommercetoolsQuoteConsumerConfigurationConfig {
    doFetchProduct: boolean;
}

export interface CommercetoolsOrderConsumerConfiguration extends CommercetoolsQuoteConsumerConfiguration {
    configuration: CommercetoolsOrderConsumerConfigurationConfig;
}
