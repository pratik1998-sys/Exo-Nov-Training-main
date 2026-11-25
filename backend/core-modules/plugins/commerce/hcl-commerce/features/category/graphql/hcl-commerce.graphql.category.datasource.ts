import { RequestContext } from "@context/request";
import { GraphqlDatasourceServiceDefinition, GraphqlDatasourceServiceDefinitions, GraphqlHttpMethods } from "@plugin-datasource-graphql";
import { HCLCommerceBaseGQLDatasource } from "@plugin-hcl-commerce/common";
import { HCLCommerceCategoryQueries, HCLCommerceCategoryResult } from "./schema/hcl-commerce.category.gql.schema";

export interface HCLCommerceCategoryServiceDefinitions extends GraphqlDatasourceServiceDefinitions {
    findTopCategories: GraphqlDatasourceServiceDefinition;
    findCategoryByIdentifier: GraphqlDatasourceServiceDefinition;
    findCategoriesByIdentifiers: GraphqlDatasourceServiceDefinition;
    findCategoryById: GraphqlDatasourceServiceDefinition;
    findCategoriesByIds: GraphqlDatasourceServiceDefinition;
}

export class HCLCommerceCategoryGQLDatasource extends HCLCommerceBaseGQLDatasource {
    protected serviceDefinitions: HCLCommerceCategoryServiceDefinitions = {
        findTopCategories: {
            id: 'findTopCategories',
            method: GraphqlHttpMethods.get,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: HCLCommerceCategoryQueries.findTopCategories,
        },
        findCategoryByIdentifier: {
            id: 'findCategoryByIdentifier',
            method: GraphqlHttpMethods.get,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: HCLCommerceCategoryQueries.findCategoryByIdentifier,
        },
        findCategoriesByIdentifiers: {
            id: 'findCategoriesByIdentifiers',
            method: GraphqlHttpMethods.get,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: HCLCommerceCategoryQueries.findCategoriesByIdentifiers,
        },
        findCategoryById: {
            id: 'findCategoryById',
            method: GraphqlHttpMethods.get,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: HCLCommerceCategoryQueries.findCategoryById,
        },
        findCategoriesByIds: {
            id: 'findCategoriesByIds',
            method: GraphqlHttpMethods.get,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: HCLCommerceCategoryQueries.findCategoriesByIds,
        },
    };

    async findTopCategories(requestContext: RequestContext): Promise<HCLCommerceCategoryResult> {
        return await this.executeFindCategory(requestContext, this.serviceDefinitions.findTopCategories);
    }

    async findCategoryByIdentifier(requestContext: RequestContext, identifier: string) {
        const variables = {
            identifier,
        };

        return await this.executeFindCategory(requestContext, this.serviceDefinitions.findCategoryByIdentifier, variables);
    }

    async findCategoryById(requestContext: RequestContext, id: string) {
        const variables = {
            id,
        };

        return await this.executeFindCategory(requestContext, this.serviceDefinitions.findCategoryById, variables);
    }

    async findCategoriesByIdentifiers(requestContext: RequestContext, identifiers: string[]) {
        const variables = {
            identifiers,
        };

        return await this.executeFindCategory(requestContext, this.serviceDefinitions.findCategoriesByIdentifiers, variables);
    }

    async findCategoriesByIds(requestContext: RequestContext, ids: string[]) {
        const variables = {
            ids,
        };

        return await this.executeFindCategory(requestContext, this.serviceDefinitions.findCategoriesByIds, variables);
    }

    protected async executeFindCategory(requestContext: RequestContext, serviceDefinition: GraphqlDatasourceServiceDefinition, variables: any = {}, query?: any) {
        const methodname = `${HCLCommerceCategoryGQLDatasource.name}.executeFindCategory`;

        const queryId = serviceDefinition.query.queryId;

        let dsResult;

        try {
            const gqlResult = await this.executeGQL(requestContext, serviceDefinition, variables, query);

            dsResult = gqlResult[queryId];
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching categories by ${queryId} ${this.logger.formatJSON(variables)}: ${this.logger.formatJSON(error)}`, requestContext);
            throw error;
        }

        return dsResult;
    }
}
