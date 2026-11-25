import { RequestContext } from "@context/request";
import { CommercetoolsBaseDatasource, CommercetoolsBaseDatasourcePathParams, CommercetoolsEntityActionRequest, CommercetoolsServiceDefinition, CommercetoolsServiceDefinitions } from "@plugin-commercetools/common";
import { CommercetoolsCustomer, CommercetoolsCustomerCreate, CommercetoolsCustomerCreateResponse } from "./schema/commercetools.ec-user.schema";
import { HttpMethods } from "@plugin-datasource-rest";
import { StringUtility } from "@utilities";

export interface CommercetoolsCustomerServiceDefinitions extends CommercetoolsServiceDefinitions {
    getMyCustomer: CommercetoolsServiceDefinition;
    getCustomerById: CommercetoolsServiceDefinition;
    getCustomerByKey: CommercetoolsServiceDefinition;
    updateCustomerById: CommercetoolsServiceDefinition;
    updateCustomerByKey: CommercetoolsServiceDefinition;
    createCustomer: CommercetoolsServiceDefinition;
}

const CommercetoolsCustomerDatasourcePathParams = {
    ...CommercetoolsBaseDatasourcePathParams,
};

export class CommercetoolsCustomerDatasource extends CommercetoolsBaseDatasource {
    protected serviceDefinitions: CommercetoolsServiceDefinitions = {
        getMyCustomer: {
            id: 'getMyCustomer',
            method: HttpMethods.get,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/me`,
            storePath: `${CommercetoolsBaseDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsBaseDatasourcePathParams.storeKey}/me`,
            timeout: 5000,
        },
        getCustomerById: {
            id: 'getCustomerById',
            method: HttpMethods.get,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/customers/${CommercetoolsBaseDatasourcePathParams.id}`,
            storePath: `${CommercetoolsBaseDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsBaseDatasourcePathParams.storeKey}/customers/${CommercetoolsBaseDatasourcePathParams.id}`,
            timeout: 5000,
        },
        getCustomerByKey: {
            id: 'getCustomerByKey',
            method: HttpMethods.get,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/customers/key=${CommercetoolsBaseDatasourcePathParams.key}`,
            storePath: `${CommercetoolsBaseDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsBaseDatasourcePathParams.storeKey}/customers/key=${CommercetoolsBaseDatasourcePathParams.key}`,
            timeout: 5000,
        },
        updateCustomerById: {
            id: 'updateCustomerById',
            method: HttpMethods.post,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/customers/${CommercetoolsBaseDatasourcePathParams.id}`,
            storePath: `${CommercetoolsBaseDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsBaseDatasourcePathParams.storeKey}/customers/${CommercetoolsBaseDatasourcePathParams.id}`,
            timeout: 5000,
        },
        updateCustomerByKey: {
            id: 'updateCustomerByKey',
            method: HttpMethods.post,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/customers/key=${CommercetoolsBaseDatasourcePathParams.key}`,
            storePath: `${CommercetoolsBaseDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsBaseDatasourcePathParams.storeKey}/customers/key=${CommercetoolsBaseDatasourcePathParams.key}`,
            timeout: 5000,
        },
        createCustomer: {
            id: 'createCustomer',
            method: HttpMethods.post,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/customers`,
            storePath: `${CommercetoolsBaseDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsBaseDatasourcePathParams.storeKey}/customers`,
            timeout: 5000,
        },
    };

    async getMyCustomer(requestContext: RequestContext) {
        const methodname = `${CommercetoolsCustomerDatasource.name}.getMyCustomer`;

        let dsResult: CommercetoolsCustomer = null;

        try {
            dsResult = await this.execute(requestContext, this.serviceDefinitions.getMyCustomer);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching my customer: ${error.message}`, requestContext);
            throw error;
        }

        return dsResult;
    }

    async getCustomer(requestContext: RequestContext, id: string, key: string) {
        const methodname = `${CommercetoolsCustomerDatasource.name}.getCustomer`;

        let dsResult: CommercetoolsCustomer = null;

        const serviceDefinition = StringUtility.isStringNotEmpty(id) ? this.serviceDefinitions.getCustomerById : this.serviceDefinitions.getCustomerByKey;

        const paramMap = this.composeParamMap(id, key);

        try {
            dsResult = await this.execute(requestContext, serviceDefinition, {}, {}, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching customer [${id || key}] via service (${serviceDefinition.id}): ${error.message}`, requestContext);
            throw error;
        }

        return dsResult;
    }

    async updateCustomer(requestContext: RequestContext, id: string, key: string, body: CommercetoolsEntityActionRequest) {
        const methodname = `${CommercetoolsCustomerDatasource.name}.updateCustomer`;

        let dsResult: CommercetoolsCustomer = null;

        const serviceDefinition = StringUtility.isStringNotEmpty(id) ? this.serviceDefinitions.updateCustomerById : this.serviceDefinitions.updateCustomerByKey;

        const paramMap = this.composeParamMap(id, key);

        try {
            dsResult = await this.execute(requestContext, serviceDefinition, {}, {}, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error updating customer [${id || key}] via service (${serviceDefinition.id}) - ${this.logger.formatJSON(body)}: ${error.message}`, requestContext);
            throw error;
        }

        return dsResult;
    }

    async createCustomer(requestContext: RequestContext, body: CommercetoolsCustomerCreate): Promise<CommercetoolsCustomerCreateResponse> {
        const methodname = `${CommercetoolsCustomerDatasource.name}.updateCustomer`;

        let dsResult: CommercetoolsCustomerCreateResponse = null;

        try {
            dsResult = await this.execute(requestContext, this.serviceDefinitions.createCustomer, {}, {}, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error creating customer - ${this.logger.formatJSON(body, true)}: ${error.message}`, requestContext);
            throw error;
        }

        return dsResult;
    }

    protected composeParamMap(id: string, key: string) {
        return {
            [CommercetoolsBaseDatasourcePathParams.id]: id,
            [CommercetoolsBaseDatasourcePathParams.key]: key,
        };
    }
}
