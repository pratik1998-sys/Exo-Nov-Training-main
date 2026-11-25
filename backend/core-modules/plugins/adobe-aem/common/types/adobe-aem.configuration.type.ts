import { ConsumerConfiguration } from "@configuration/types";

export interface AdobeAEMPersistedQuery {
    id?: string;
    graphqlPath: string;
    contentFragmentPath: string;
}

export interface AdobeAEMConsumerConfigurationConfig extends ConsumerConfiguration {
    isBasicAuth: boolean;
    appRootPath: string;
    persistedQueries: Record<string, AdobeAEMPersistedQuery>;
}

export interface AdobeAEMConsumerConfiguration extends ConsumerConfiguration {
    configuration: AdobeAEMConsumerConfigurationConfig;
    aemAppId: string;
    aemSiteId: string;
}

