import { AdobeAEMBaseDatasource, AdobeAEMDatasourcePathParams } from "@plugin-adobe-aem/common";
import { RequestContext } from "@context/request";
import { HttpMethods, RestDatasourceServiceDefinition, RestDatasourceServiceDefinitions } from "@plugin-datasource-rest";

export interface AdobeAEMNotificationServiceDefinitions extends RestDatasourceServiceDefinitions {
    getNotificationsByPath: RestDatasourceServiceDefinition;
}

export class AdobeAEMNotificationDatasource extends AdobeAEMBaseDatasource {
    protected serviceDefinitions: AdobeAEMNotificationServiceDefinitions = {
        getNotificationsByPath: {
            id: 'getNotificationsByPath',
            method: HttpMethods.post,
            path: AdobeAEMDatasourcePathParams.path,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
    };

    async getNotifications(requestContext: RequestContext) {
        return await this.executePersistedQueryByPath(requestContext, this.serviceDefinitions.getNotificationsByPath, null, 'alertCFPath');
    }
}
