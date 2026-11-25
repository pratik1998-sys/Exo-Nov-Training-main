import { RequestContext } from "@context/request";
import { AdobeAEMBaseDatasource, AdobeAEMDatasourcePathParams } from "@plugin-adobe-aem/common";
import { HttpMethods, RestDatasourceServiceDefinition, RestDatasourceServiceDefinitions } from "@plugin-datasource-rest";

export interface AdobeAEMNavigationServiceDefinitions extends RestDatasourceServiceDefinitions {
    getHeaderByPath: RestDatasourceServiceDefinition;
    getFooterByPath: RestDatasourceServiceDefinition;
}

export class AdobeAEMNavigationDatasource extends AdobeAEMBaseDatasource {
    protected serviceDefinitions: AdobeAEMNavigationServiceDefinitions = {
        getHeaderByPath: {
            id: 'getHeaderByPath',
            method: HttpMethods.post,
            path: AdobeAEMDatasourcePathParams.path,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },

        getFooterByPath: {
            id: 'getFooterByPath',
            method: HttpMethods.post,
            path: AdobeAEMDatasourcePathParams.path,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
    };

    async getHeaderNavigation(requestContext: RequestContext) {
        const result = await this.executePersistedQueryByPath(requestContext, this.serviceDefinitions.getHeaderByPath, null, 'headerCFPath');

        return result?.data?.simpleHeaderNavigationList?.items.length > 0 ? result.data.simpleHeaderNavigationList.items[0] : {};
    }

    async getFooterNavigation(requestContext: RequestContext) {
        return await this.executePersistedQueryByPath(requestContext, this.serviceDefinitions.getFooterByPath, null, 'footerCFPath');
    }
}
