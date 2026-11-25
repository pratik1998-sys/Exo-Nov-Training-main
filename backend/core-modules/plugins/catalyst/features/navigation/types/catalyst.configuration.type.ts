import { ConsumerConfiguration } from "@configuration/types";

export interface CatalystNavigationConsumerLabel {
    locale: string;
    value: string;
}

export interface CatalystNavigationConsumerOption {
    id: string;
    url: string;
    label: CatalystNavigationConsumerLabel[];
}

export interface CatalystNavigationConsumerConfigurationConfig extends ConsumerConfiguration {
    mainNavigation: CatalystNavigationConsumerOption[];
    quickNavigation: CatalystNavigationConsumerOption[];
}

export interface CatalystNavigationConsumerConfiguration extends ConsumerConfiguration {
    configuration: CatalystNavigationConsumerConfigurationConfig;
}
