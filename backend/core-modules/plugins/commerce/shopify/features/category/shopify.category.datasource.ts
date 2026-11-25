import { GraphqlDatasourceQuery, GraphqlDatasourceServiceDefinition, GraphqlDatasourceServiceDefinitions } from '@plugin-datasource-graphql';
import { ShopifyCollection, ShopifyCollectionInput, ShopifyCollectionResultSet, ShopifyCollectionResultSetInput, ShopifyColletionQuery } from './shopify.category.schema';
import { HttpMethods } from '@plugin-datasource-rest';
import { ShopifyBaseDatasource } from '@plugin-shopify/common';
import { RequestContext } from '@context/request';
import { ShopifyMenu } from '@plugin-shopify/common/schema/shopify.menu.schema';


export interface ShopifyCategoryServiceDefinitions extends GraphqlDatasourceServiceDefinitions {
    getCollection: GraphqlDatasourceServiceDefinition;
    getCollectionWithProducts: GraphqlDatasourceServiceDefinition;
    getCollections: GraphqlDatasourceServiceDefinition;
    getCollectionsWithProducts: GraphqlDatasourceServiceDefinition;
}

export class ShopifyCategoryDatasource extends ShopifyBaseDatasource {
    protected serviceDefinitions: ShopifyCategoryServiceDefinitions = {
        getCollection: {
            id: 'getCollection',
            method: HttpMethods.post,
            timeout: 5000,
            query: null,
        },
        getCollectionWithProducts: {
            id: 'getCollectionWithProducts',
            method: HttpMethods.post,
            timeout: 5000,
            query: null,
        },
        getCollections: {
            id: 'getCollections',
            method: HttpMethods.get,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: null,
        },
        getCollectionsWithProducts: {
            id: 'getCollectionsWithProducts',
            method: HttpMethods.get,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: null,
        },
    };

    async getCollection<T extends ShopifyCollection>(requestContext: RequestContext, id: string, handle: string, includeProducts: boolean): Promise<T> {
        const serviceDefinition = includeProducts ? this.serviceDefinitions.getCollectionWithProducts : this.serviceDefinitions.getCollection;

        const variables: ShopifyCollectionInput = {
            id,
            handle,
        };

        const query: GraphqlDatasourceQuery = this.getCollectionQuery(serviceDefinition.id, includeProducts);

        const result = await this.executeGQLService<{ collection: ShopifyCollection }>(requestContext, serviceDefinition, variables, query);

        return result.collection as T;
    }

    async getCollections<T extends ShopifyCollectionResultSet>(requestContext: RequestContext, first: number, after: number, includeProducts: boolean): Promise<T> {
        const serviceDefinition = includeProducts ? this.serviceDefinitions.getCollectionsWithProducts : this.serviceDefinitions.getCollections;

        const variables: ShopifyCollectionResultSetInput = {
            first,
            after,
        };

        const query: GraphqlDatasourceQuery = this.getCollectionsQuery(serviceDefinition.id, includeProducts);

        const result = await this.executeGQLService<{ collections: ShopifyCollectionResultSet }>(requestContext, serviceDefinition, variables, query);

        return result.collections as T;
    }

    protected getCollectionQuery(serviceId: string, includeProducts: boolean): GraphqlDatasourceQuery {
        const cacheKey = `${serviceId}:${includeProducts ? 'with-products' : 'no-products'}`;

        let query: GraphqlDatasourceQuery = this.getQueryCacheEntry(cacheKey);

        if (query == null) {
            query = this.getQueryClass().getCollection(includeProducts);

            this.setQueryCacheEntry(cacheKey, query);
        }

        return query;
    }

    protected getCollectionsQuery(serviceId: string, includeProducts: boolean): GraphqlDatasourceQuery {
        const cacheKey = `${serviceId}:${includeProducts ? 'with-products' : 'no-products'}`;

        let query: GraphqlDatasourceQuery = this.getQueryCacheEntry(cacheKey);

        if (query == null) {
            query = this.getQueryClass().getCollections(includeProducts);

            this.setQueryCacheEntry(cacheKey, query);
        }

        return query;
    }

    async getMenu<T extends ShopifyMenu>(requestContext: RequestContext, handle: string, depth: number, includeProducts: boolean): Promise<T> {
        return await super.getMenu(requestContext, handle, depth, includeProducts);
    }

    protected getQueryClass(): typeof ShopifyColletionQuery {
        return ShopifyColletionQuery;
    }
}
