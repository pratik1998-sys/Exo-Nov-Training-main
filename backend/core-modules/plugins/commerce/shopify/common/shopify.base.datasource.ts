import { RequestContext } from "@context/request";
import { BaseGraphqlDatasource, GraphQLDatasourceConfig, GraphqlDatasourceQuery, GraphqlDatasourceServiceDefinition, GraphqlDatasourceServiceDefinitions } from "@plugin-datasource-graphql";
import { HttpMethods } from "@plugin-datasource-rest";
import { ShopifyBaseErrors, ShopifyConsumerConfiguration } from "@plugin-shopify/common";
import { ShopifyMenu, ShopifyMenuInput, ShopifyMenuQuery } from "@plugin-shopify/common/schema/shopify.menu.schema";
import { ShopifyMetaObject, ShopifyMetaObjectHandleInput, ShopifyMetaObjectInput, ShopifyMetaObjectQuery } from "@plugin-shopify/common/schema/shopify.metaobject.schema";
import { StringUtility } from "@utilities";

export interface ShopifyServiceDefinitions extends GraphqlDatasourceServiceDefinitions {
    getMetaObject: GraphqlDatasourceServiceDefinition;
    getMetaObjectWithProducts: GraphqlDatasourceServiceDefinition;
    getMenu: GraphqlDatasourceServiceDefinition;
}

export abstract class ShopifyBaseDatasource extends BaseGraphqlDatasource {
    protected baseServiceDefinitions: ShopifyServiceDefinitions = {
        getMetaObject: {
            id: 'getMetaObject',
            method: HttpMethods.post,
            timeout: 5000,
            query: null,
        },
        getMetaObjectWithProducts: {
            id: 'getMetaObjectWithProducts',
            method: HttpMethods.post,
            timeout: 5000,
            query: null,
        },
        getMenu: {
            id: 'getMenu',
            method: HttpMethods.post,
            timeout: 5000,
            query: null,
        },
    };
    protected shopifyGraphqlPath: string;

    protected readonly headers: Record<string, string> = {
        accessToken: 'X-Shopify-Storefront-Access-Token',
    };

    async getMetaObject<T extends ShopifyMetaObject>(requestContext: RequestContext, id: string, handle: ShopifyMetaObjectHandleInput, includeProducts: boolean): Promise<T> {
        const serviceDefinition = includeProducts ? this.baseServiceDefinitions.getMetaObjectWithProducts : this.baseServiceDefinitions.getMetaObject;

        const variables: ShopifyMetaObjectInput = {
            id,
            handle,
        };

        const query: GraphqlDatasourceQuery = this.getMetaObjectQuery(serviceDefinition.id, StringUtility.isStringNotEmpty(id), includeProducts);

        const result = await this.executeGQLService<{ metaobject: ShopifyMetaObject }>(requestContext, serviceDefinition, variables, query);

        return result.metaobject as T;
    }

    async getMenu<T extends ShopifyMenu>(requestContext: RequestContext, handle: string, depth: number, includeProducts?: boolean): Promise<T> {
        const variables: ShopifyMenuInput = {
            handle,
        };

        const serviceId = this.baseServiceDefinitions.getMenu.id;

        const query: GraphqlDatasourceQuery = this.getMenuQuery(serviceId, depth, includeProducts);

        const result = await this.executeGQLService<{ menu: ShopifyMenu }>(requestContext, this.baseServiceDefinitions.getMenu, variables, query);

        return result.menu as T;
    }

    protected getMetaObjectQuery(serviceId: string, isById: boolean, includeProducts: boolean): GraphqlDatasourceQuery {
        let query: GraphqlDatasourceQuery = this.getQueryCacheEntry(serviceId);

        if (query == null) {
            query = isById ? this.getMetaObjectQueryClass().getMetaObject(includeProducts) : this.getMetaObjectQueryClass().getMetaObjectByHandle(includeProducts);

            this.setQueryCacheEntry(serviceId, query);
        }

        return query;
    }

    protected getMenuQuery(serviceId: string, depth: number, includeProducts: boolean): GraphqlDatasourceQuery {
        if (depth > 5) {
            throw ShopifyBaseErrors.maxDepthExceeded();
        }

        const cacheKey = `${serviceId}:${depth}`;

        let query: GraphqlDatasourceQuery = this.getQueryCacheEntry(cacheKey);

        if (query == null) {
            query = this.getMenuQueryClass().getMenu(depth);

            this.setQueryCacheEntry(cacheKey, query);
        }

        return query;
    }

    protected getMetaObjectQueryClass(): typeof ShopifyMetaObjectQuery {
        return ShopifyMetaObjectQuery;
    }

    protected getMenuQueryClass(): typeof ShopifyMenuQuery {
        return ShopifyMenuQuery;
    }

    protected composePath(requestContext: RequestContext, datasourceConfig: GraphQLDatasourceConfig, serviceDefinition: GraphqlDatasourceServiceDefinition, paramMap: Record<string, string>) {
        const { configuration, variantId } = this.getPluginConsumerConfiguration<ShopifyConsumerConfiguration>(requestContext);

        let { apiVersion } = configuration;

        apiVersion = StringUtility.isStringNotEmpty(apiVersion) ? apiVersion : variantId;

        if (!this.shopifyGraphqlPath) {
            this.shopifyGraphqlPath = datasourceConfig.graphqlPath.replace(':version', apiVersion);
        }

        return this.shopifyGraphqlPath;
    }

    protected composeHeaders(
        requestContext: RequestContext,
        datasourceConfig: GraphQLDatasourceConfig,
        headers: Record<string, any>,
        serviceDefinition: GraphqlDatasourceServiceDefinition,
    ): Record<string, any> {
        headers = {
            ...headers,
            [this.headers.accessToken]: datasourceConfig.apiKey,
        };

        return headers;
    }
}
