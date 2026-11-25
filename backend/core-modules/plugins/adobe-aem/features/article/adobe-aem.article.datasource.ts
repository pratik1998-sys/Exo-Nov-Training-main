import { RequestContext } from '@context/request';
import { AdobeAEMBaseDatasource, AdobeAEMDatasourcePathParams } from '@plugin-adobe-aem/common';
import { HttpMethods, RestDatasourceServiceDefinition, RestDatasourceServiceDefinitions } from '@plugin-datasource-rest';

export interface AdobeAEMArticleServiceDefinitions
    extends RestDatasourceServiceDefinitions {
    getArticlesByPath: RestDatasourceServiceDefinition;
    getArticleByPath: RestDatasourceServiceDefinition;
}

export class AdobeAEMArticleDatasource extends AdobeAEMBaseDatasource {
    protected serviceDefinitions: AdobeAEMArticleServiceDefinitions = {
        getArticlesByPath: {
            id: 'getArticlesByPath',
            method: HttpMethods.post,
            path: AdobeAEMDatasourcePathParams.path,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        getArticleByPath: {
            id: 'getArticleByPath',
            method: HttpMethods.post,
            path: AdobeAEMDatasourcePathParams.path,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
    };

    async getArticles(requestContext: RequestContext, type?: string): Promise<{ nodes: any[]; pageInfo?: any }> {
        const variables = {
            type: type,
        };

        return await this.executePersistedQueryByPath(requestContext, this.serviceDefinitions.getArticlesByPath, variables, 'path');
    }

    async getArticleByPath(requestContext: RequestContext, id: string): Promise<any> {
        return await this.executePersistedQueryByPath(requestContext, this.serviceDefinitions.getArticleByPath, null, '_path', id);
    }
}
