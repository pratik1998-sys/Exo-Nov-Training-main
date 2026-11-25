import { AdobeAEMCredentials } from './types/adobe-aem.credentials.type';
import { AdobeAEMConsumerConfiguration } from './types/adobe-aem.configuration.type';
import auth from '@adobe/jwt-auth';
import { BaseRegistry } from '@registry';
import { AdobeAEMEnvironmentVariableKeys } from './adobe-aem.environment';

export class AdobeAEMAuthenticationRegistry extends BaseRegistry {
    static registryId: string = 'adobe-aem.authentication.registry';

    private data: AdobeAEMCredentials;

    protected async load() {
        const methodname = `${AdobeAEMAuthenticationRegistry.name}.load`;

        const { configuration } = this.getPluginConsumerConfiguration<AdobeAEMConsumerConfiguration>({ consumer: this.defaultConsumerId });

        if (configuration.isBasicAuth) {
            this.logger.info(`${methodname} - AEM Basic Auth enabled`);

            const adobeIMSConfig = JSON.parse(this.configService.get(AdobeAEMEnvironmentVariableKeys.adobeIMS_aem));

            const token = Buffer.from(`${adobeIMSConfig.username}:${adobeIMSConfig.password}`).toString('base64');

            this.data = {
                type: null,
                token: token,
                expires: null,
                authorizationHeader: `Basic ${token}`,
            };
        } else {
            this.data = await this.fetchData();
        }
    }

    protected async fetchData() {
        const methodname = `${AdobeAEMAuthenticationRegistry.name}.fetchData`;

        let creds: AdobeAEMCredentials = null;

        let adobeIMSConfig = this.configService.get(AdobeAEMEnvironmentVariableKeys.adobeIMS_aem);

        if (adobeIMSConfig != null && adobeIMSConfig.trim() != '') {
            adobeIMSConfig = JSON.parse(adobeIMSConfig);

            const res = await auth(adobeIMSConfig);

            creds = {
                type: res.token_type,
                token: res.access_token,
                expires: res.expires_in,
                authorizationHeader: `Bearer ${res.access_token}`,
            };
        } else {
            this.logger.info(`${methodname} - Missing Adobe IMS Environment Configuration ${AdobeAEMEnvironmentVariableKeys.adobeIMS_aem}`);
        }

        return creds;
    }

    getRegistryData() {
        return this.data;
    }

    getAccessToken() {
        return this.data.token;
    }

    getAuthorizationHeader() {
        return this.data.authorizationHeader;
    }
}
