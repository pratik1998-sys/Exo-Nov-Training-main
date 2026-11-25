import { RequestContext } from '@context/request';
import { TutorialPetRestDatasourceConfig } from './tutorial-pet-rest.datasource.config';
import { BaseRestDatasource, RestDatasourceServiceDefinition } from '@plugin-datasource-rest';
import { TokenUtility } from '@token/utilities';

export const TutorialPetRestBaseDatasourcePathParams = {
    identifier: '{identifier}',
};

export abstract class TutorialPetRestBaseDatasource extends BaseRestDatasource {
    protected consumerApiKeys: Record<string, string> = {};

    protected readonly headerAPIKey: string = 'x-api-key';
    protected readonly headerToken: string = 'x-token';

    protected composeHeaders(requestContext: RequestContext, datasourceConfig: any, headers: Record<string, any>, serviceDefinition: RestDatasourceServiceDefinition) {
        headers = super.composeHeaders(requestContext, datasourceConfig, headers, serviceDefinition);

        const { clientId, clientSecret } = this.getDatasourceConfig<TutorialPetRestDatasourceConfig>(requestContext);

        if (!this.consumerApiKeys[requestContext.consumer]) {
            this.consumerApiKeys[requestContext.consumer] = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        }

        headers[this.headerAPIKey] = this.consumerApiKeys[requestContext.consumer];

        headers[this.headerToken] = requestContext.tokens?.[this.getPluginTokenId(requestContext)]?.token;

        return headers;
    }
}
