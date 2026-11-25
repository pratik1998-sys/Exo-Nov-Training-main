import { RequestContext } from "@context/request";
import { HttpMethods, RestDatasourceServiceDefinition, RestDatasourceServiceDefinitions } from "@plugin-datasource-rest";
import { SAPCommerceBaseDatasource, SAPCommerceBaseDatasourcePathParams } from "@plugin-sap-commerce/common";

const SAPCommerceProductDatasourcePathParams = {
    ...SAPCommerceBaseDatasourcePathParams,
    productCode: '{productCode}',
    userId: '{userId}',
};

export interface SAPCommerceProductServiceDefinitions extends RestDatasourceServiceDefinitions {
    getProducts: RestDatasourceServiceDefinition;
    getProduct: RestDatasourceServiceDefinition;
}

export class SAPCommerceProductDatasource extends SAPCommerceBaseDatasource {
    protected serviceDefinitions: SAPCommerceProductServiceDefinitions = {
        getProduct: {
            id: 'getProduct',
            method: HttpMethods.get,
            path: `/occ/v2/${SAPCommerceProductDatasourcePathParams.baseSiteId}/products/${SAPCommerceProductDatasourcePathParams.productCode}`,
            timeout: 10000,
            retryConfig: {
                maxAttempts: 1,
                ignoreStatuses: [401],
            },
        },
        getProducts: {
            id: 'getProducts',
            method: HttpMethods.get,
            path: `/occ/v2/${SAPCommerceProductDatasourcePathParams.baseSiteId}/products/search`,
            timeout: 10000,
            retryConfig: {
                maxAttempts: 1,
                ignoreStatuses: [401],
            },
        },
    };

    async getProduct(requestContext: RequestContext, productCode: string): Promise<any> {
        const methodname: string = `${SAPCommerceProductDatasource.name}.getProduct`;

        const paramMap = {
            [SAPCommerceProductDatasourcePathParams.productCode]: productCode,
        };

        return await this.executeProductService(requestContext, this.serviceDefinitions.getProduct, {}, {}, paramMap);
    }

    async getProducts(requestContext: RequestContext, query: Record<string, any>): Promise<any> {
        const methodname: string = `${SAPCommerceProductDatasource.name}.getProductsByStore`;

        return await this.executeProductService(requestContext, this.serviceDefinitions.getProducts, query);
    }

    protected async executeProductService(
        requestContext: RequestContext,
        serviceDefinition: RestDatasourceServiceDefinition,
        queryParams?: Record<string, any>,
        headers?: Record<string, string>,
        paramMap?: Record<string, string>,
    ) {
        const methodname = `${SAPCommerceProductDatasource.name}.executeProductService`;

        let result;

        paramMap = paramMap ?? {};

        try {
            result = await this.execute(requestContext, serviceDefinition, queryParams, headers, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [${serviceDefinition.id}] - (${this.logger.formatJSON(paramMap)}): ${this.logger.formatJSON(error)}`, requestContext);
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
