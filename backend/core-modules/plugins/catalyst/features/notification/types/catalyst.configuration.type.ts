import { ConsumerConfiguration } from "@configuration/types";

export interface CatalystNotificationConsumerLabel {
    locale: string;
    value: string;
}

export interface CatalystNotificationConsumerOption {
    id: string;
    description: CatalystNotificationConsumerLabel[];
}

export interface CatalystNotificationConsumerConfigurationConfig extends ConsumerConfiguration {
    notifications: CatalystNotificationConsumerOption[];
}

export interface CatalystNotificationConsumerConfiguration extends ConsumerConfiguration {
    configuration: CatalystNotificationConsumerConfigurationConfig;
}
