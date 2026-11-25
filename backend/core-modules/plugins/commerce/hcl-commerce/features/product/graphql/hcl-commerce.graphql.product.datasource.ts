import { RequestContext } from "@context/request";
import { GraphqlDatasourceServiceDefinition, GraphqlDatasourceServiceDefinitions, GraphqlHttpMethods } from "@plugin-datasource-graphql";
import { HCLCommerceBaseGQLDatasource } from "@plugin-hcl-commerce/common";
import { HCLCommerceProductFilter } from "../schema/hcl-commerce.product.filter";
import { HCLCommerceProductQueries } from "./schema/hcl-commerce.product.gql.schema";

export interface HCLCommerceProductServiceDefinitions extends GraphqlDatasourceServiceDefinitions {
    findProductByPartnumber: GraphqlDatasourceServiceDefinition;
    findProductsByPartnumbers: GraphqlDatasourceServiceDefinition;
    findProductById: GraphqlDatasourceServiceDefinition;
    findProductsByIds: GraphqlDatasourceServiceDefinition;
    findProducts: GraphqlDatasourceServiceDefinition;
}

export type { HCLCommerceProductFilter } from "../schema/hcl-commerce.product.filter";

export class HCLCommerceProductDatasource extends HCLCommerceBaseGQLDatasource {
    protected serviceDefinitions: HCLCommerceProductServiceDefinitions = {
        findProductByPartnumber: {
            id: 'findProductByPartnumber',
            method: GraphqlHttpMethods.get,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: HCLCommerceProductQueries.findProductByPartnumber,
        },
        findProductsByPartnumbers: {
            id: 'findProductsByPartnumbers',
            method: GraphqlHttpMethods.get,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: HCLCommerceProductQueries.findProductsByPartNumbers,
        },
        findProductById: {
            id: 'findProductById',
            method: GraphqlHttpMethods.get,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: HCLCommerceProductQueries.findProductById,
        },
        findProductsByIds: {
            id: 'findProductsByIds',
            method: GraphqlHttpMethods.get,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: HCLCommerceProductQueries.findProductsByIds,
        },
        findProducts: {
            id: 'findProducts',
            method: GraphqlHttpMethods.get,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: HCLCommerceProductQueries.findProducts,
        },
    };

    async findProductByPartnumber(requestContext: RequestContext, partNumber: string) {
        const variables = {
            partNumber,
        };

        return await this.executeFindProduct(requestContext, this.serviceDefinitions.findProductByPartnumber, variables);
    }

    async findProductsByPartnumbers(requestContext: RequestContext, partNumbers: string[], limit?: number, offset?: number) {
        const variables = {
            partNumbers,
            limit,
            offset,
        };

        return await this.executeFindProduct(requestContext, this.serviceDefinitions.findProductsByPartnumbers, variables);
    }

    async findProductById(requestContext: RequestContext, id: string, limit?: number, offset?: number) {
        const variables = {
            id,
            limit,
            offset,
        };

        return await this.executeFindProduct(requestContext, this.serviceDefinitions.findProductById, variables);
    }

    async findProductsByIds(requestContext: RequestContext, ids: string[], limit?: number, offset?: number) {
        const variables = {
            ids,
            limit,
            offset,
        };

        return await this.executeFindProduct(requestContext, this.serviceDefinitions.findProductsByIds, variables);
    }

    async findProducts(requestContext: RequestContext, filter: HCLCommerceProductFilter) {
        const methodname = `${HCLCommerceProductDatasource.name}.findProducts`;

        const { categoryId, searchTerm, ids, partnumbers, limit, offset } = filter;

        this.logger.debug(`${methodname} - Executing with filter parameters:`, requestContext);
        this.logger.debug(`${methodname} - searchTerm: ${searchTerm}, categoryId: ${categoryId}`, requestContext);
        this.logger.debug(`${methodname} - batch: ids=${ids?.length || 0}, partnumbers=${partnumbers?.length || 0}`, requestContext);
        this.logger.debug(`${methodname} - pagination: limit=${limit}, offset=${offset}`, requestContext);

        const variables = {
            categoryId,
            searchTerm,
            ids,
            partnumbers,
            limit,
            offset,
        };

        return await this.executeFindProduct(requestContext, this.serviceDefinitions.findProducts, variables);
    }

    protected async executeFindProduct(requestContext: RequestContext, serviceDefinition: GraphqlDatasourceServiceDefinition, variables: any = {}, query?: any) {
        const methodname = `${HCLCommerceProductDatasource.name}.executeFindProduct`;

        const queryId = serviceDefinition.query.queryId;

        this.logger.debug(`${methodname} - Executing ${serviceDefinition.id} (${queryId}) with variables: ${JSON.stringify(variables)}`, requestContext);

        let dsResult;

        try {
            const gqlResult = await this.executeGQL(requestContext, serviceDefinition, variables, query);
            dsResult = gqlResult[queryId];

            if (dsResult) {
                this.logger.debug(`${methodname} - ${serviceDefinition.id} returned ${dsResult.recordSetTotal || dsResult.catalogEntryView?.length || 0} results`, requestContext);
            } else {
                this.logger.debug(`${methodname} - ${serviceDefinition.id} returned no data`, requestContext);
            }
        } catch (error) {
            this.logger.error(`${methodname} - Error fetching products by ${queryId} ${this.logger.formatJSON(variables)}: ${this.logger.formatJSON(error)}`, requestContext);
            throw error;
        }

        return dsResult;
    }
}
