import { RequestContext } from "@context/request";
import { AdobeCommerceAttributeInput, AdobeCommerceAttributeQueries, AdobeCommerceBaseDatasource, AdobeCommerceCustomAttributeMetadata } from "@plugin-adobe-commerce/common";
import { AdobeCommerceProductAttributeFilterInput, AdobeCommerceProductAttributeSortInput, AdobeCommerceProductQueries, AdobeCommerceProductResult } from "./schema/adobe-commerce.product.schema";
import { GraphqlDatasourceServiceDefinition, GraphqlDatasourceServiceDefinitions, GraphqlHttpMethods } from "@plugin-datasource-graphql";

export interface AdobeCommerceProductServiceDefinitions extends GraphqlDatasourceServiceDefinitions {
    getProducts: GraphqlDatasourceServiceDefinition;
    getAttributeMetadata: GraphqlDatasourceServiceDefinition;
}

export class AdobeCommerceProductDatasource extends AdobeCommerceBaseDatasource {
    protected serviceDefinitions: AdobeCommerceProductServiceDefinitions = {
        getProducts: {
            id: 'getProducts',
            method: GraphqlHttpMethods.get,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            //query: AdobeCommerceBaseDatasource.prettifyQuery(AdobeCommerceProductQueries.getProducts(['army_contract', 'army_vendor']))
            query: undefined,
        },
        getAttributeMetadata: {
            id: 'getAttributeMetadata',
            method: GraphqlHttpMethods.get,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: AdobeCommerceAttributeQueries.getCustomAttributeMetaData,
        },
    };

    async getProducts(
        requestContext: RequestContext,
        search: string,
        filter: AdobeCommerceProductAttributeFilterInput,
        pageSize: number,
        currentPage: number,
        sort: AdobeCommerceProductAttributeSortInput,
    ) {
        const methodname = `${AdobeCommerceProductDatasource.name}.getProducts`;

        const variables = {
            search: search ?? undefined,
            filter: filter ?? undefined,
            pageSize,
            currentPage,
            sort: sort ?? undefined,
        };

        const gqlResult = await this.executeGQLService<{ products: AdobeCommerceProductResult }>(
            requestContext,
            this.serviceDefinitions.getProducts,
            variables,
            this.getProductsQuery(requestContext),
        );

        return gqlResult.products;
    }

    async getProductAttributeMetadata(requestContext: RequestContext) {
        const methodname = `${AdobeCommerceProductDatasource.name}.getProductAttributeMetadata`;

        const attributes: AdobeCommerceAttributeInput[] = [];

        this.getProductAttributes(requestContext).forEach((customAttributeId) => {
            attributes.push({
                attribute_code: customAttributeId,
                entity_type: 'catalog_product',
            });
        });

        const variables = {
            attributes,
        };

        const gqlResult = await this.executeGQLService<{ customAttributeMetadata: { items: AdobeCommerceCustomAttributeMetadata[] } }>(
            requestContext,
            this.serviceDefinitions.getAttributeMetadata,
            variables,
        );

        return gqlResult.customAttributeMetadata?.items;
    }

    protected getProductsQuery(requestContext: RequestContext) {
        const service = this.serviceDefinitions.getProducts;

        if (!service.query) {
            this.setServiceDynamicQuery(service, AdobeCommerceProductQueries.getProducts(this.getProductAttributes(requestContext)));
        }

        return service.query;
    }
}
