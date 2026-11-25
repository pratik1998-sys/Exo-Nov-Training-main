import { EnvironmentVariableKeys, EnvironmentVariableKeysType } from "@configuration/environment";

export interface AdobeAEMEnvironmentVariableKeysType extends EnvironmentVariableKeysType {
    adobeIMS_aem: string;
}

export const AdobeAEMEnvironmentVariableKeys: AdobeAEMEnvironmentVariableKeysType = {
    ...EnvironmentVariableKeys,
    adobeIMS_aem: 'ADOBE_IMS_AEM'
}
