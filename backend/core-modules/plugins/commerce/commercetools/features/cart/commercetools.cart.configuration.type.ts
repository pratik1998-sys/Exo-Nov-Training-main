import { CommercetoolsQuoteConsumerConfigurationConfig, CommercetoolsQuoteConsumerConfiguration } from "@plugin-commercetools/features/quote";

export interface CommercetoolsCartConsumerConfigurationConfig extends CommercetoolsQuoteConsumerConfigurationConfig {
    deleteCartAfterDays: number;
    isShippingMethodsCartSpecific: boolean;
    orderNumberPrefix: string;
}

export interface CommercetoolsCartConsumerConfiguration extends CommercetoolsQuoteConsumerConfiguration {
    configuration: CommercetoolsCartConsumerConfigurationConfig;
}
