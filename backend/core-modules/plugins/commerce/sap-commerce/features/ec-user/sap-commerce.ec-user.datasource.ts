import { RequestContext } from "@context/request";
import { ECUserCreateInput } from "@feature-commerce/ec-user";
import { HttpMethods, RestDatasourceServiceDefinition, RestDatasourceServiceDefinitions } from "@plugin-datasource-rest";
import { CreateUser, GetUser, SAPCommerceBaseDatasource, SAPCommerceBaseDatasourcePathParams } from "@plugin-sap-commerce/common";

const SAPCommerceCategoryDatasourcePathParams = {
    ...SAPCommerceBaseDatasourcePathParams,
};

export interface SAPCommerceECUserServiceDefinitions extends RestDatasourceServiceDefinitions {
    getUser: RestDatasourceServiceDefinition;
    createUser: RestDatasourceServiceDefinition;
}

export class SAPCommerceECUserDatasource extends SAPCommerceBaseDatasource {
    protected serviceDefinitions: SAPCommerceECUserServiceDefinitions = {
        getUser: {
            id: 'getUser',
            method: HttpMethods.get,
            path: `/occ/v2/${SAPCommerceCategoryDatasourcePathParams.baseSiteId}/users/${SAPCommerceCategoryDatasourcePathParams.userId}`,
            timeout: 10000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        createUser: {
            id: 'createUser',
            method: HttpMethods.post,
            path: `/occ/v2/${SAPCommerceCategoryDatasourcePathParams.baseSiteId}/users`,
            timeout: 10000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
    };


    async getUser(requestContext: RequestContext): Promise<GetUser.Response._200> {
        const methodname: string = `${SAPCommerceECUserDatasource.name}.getUser`;

        return await this.executeUserService(requestContext, this.serviceDefinitions.getUser);
    }

    async createUser(requestContext: RequestContext, userInput: ECUserCreateInput): Promise<CreateUser.Response._201> {
        const methodname: string = `${SAPCommerceECUserDatasource.name}.createUser`;

        const body: CreateUser.Body = {
            uid: userInput.username,
            password: userInput.password,
            firstName: userInput.firstName,
            lastName: userInput.lastName,
        };

        return await this.executeUserService(requestContext, this.serviceDefinitions.createUser, {}, {}, {}, body);
    }

    protected async executeUserService(
        requestContext: RequestContext,
        serviceDefinition: RestDatasourceServiceDefinition,
        queryParams?: Record<string, any>,
        headers?: Record<string, string>,
        paramMap?: Record<string, string>,
        body?: Record<string, any>,
    ) {
        const methodname = `${SAPCommerceECUserDatasource.name}.executeUserService`;

        let result;

        try {
            result = await this.execute(requestContext, serviceDefinition, queryParams, headers, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [${serviceDefinition.id}] - (${this.logger.formatJSON(paramMap)}): ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    protected composeQueryParams(requestContext: RequestContext, dataSourceConfig: any, queryParams: any) {
        queryParams = super.composeQueryParams(requestContext, dataSourceConfig, queryParams);

        queryParams.fields = 'FULL';

        return queryParams;
    }
}
