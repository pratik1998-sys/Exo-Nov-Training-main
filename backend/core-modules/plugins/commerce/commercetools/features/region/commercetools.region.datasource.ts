import { RequestContext } from "@context/request";
import { CommercetoolsBaseDatasource, CommercetoolsBaseDatasourcePathParams, CommercetoolsConsumerConfiguration, CommercetoolsServiceDefinition, CommercetoolsServiceDefinitions } from "@plugin-commercetools/common";
import { CommercetoolsStore } from "@plugin-commercetools/features/store";
import { HttpMethods } from "@plugin-datasource-rest";

const CommercetoolsRegionDatasourcePathParams = {
    ...CommercetoolsBaseDatasourcePathParams,
};

export interface CommercetoolsRegionServiceDefinitions extends CommercetoolsServiceDefinitions {
    getStoreByKey: CommercetoolsServiceDefinition;
}

export class CommercetoolsRegionDatasource extends CommercetoolsBaseDatasource {
    protected serviceDefinitions: CommercetoolsRegionServiceDefinitions = {
        getStoreByKey: {
            id: 'getStoreByKey',
            method: HttpMethods.get,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/stores/key=${CommercetoolsBaseDatasourcePathParams.key}`,
            isAdminService: true,
            timeout: 5000,
        },
    };

    async getStore(requestContext: RequestContext): Promise<CommercetoolsStore> {
        const methodname = `${CommercetoolsRegionDatasource.name}.getStore`;

        const { storeId } = this.getPluginConsumerConfiguration<CommercetoolsConsumerConfiguration>(requestContext).configuration;

        return await this.getStoreByKey(requestContext, storeId);
    }

    async getStoreByKey(requestContext: RequestContext, key: string): Promise<CommercetoolsStore> {
        const methodname = `${CommercetoolsRegionDatasource.name}.getStore`;

        let dsResult: CommercetoolsStore = null;

        const paramMap = {
            [CommercetoolsRegionDatasourcePathParams.key]: key,
        };

        try {
            dsResult = await this.execute(requestContext, this.serviceDefinitions.getStoreByKey, {}, {}, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching store [${key}]: ${error.message}`, requestContext);
            throw error;
        }

        return dsResult;
    }
}
