import { GraphqlDatasourceQuery } from "@plugin-datasource-graphql";
import { ShopifyImage, ShopifyResultSet, ShopifyResultSetInput, ShopifySEO } from "@plugin-shopify/common/schema/shopify.base.schema";

export class ShopifyCollection {
    description?: string;
    descriptionHtml?: string;
    handle?: string;
    id?: string;
    image?: ShopifyImage;
    onlineStoreUrl?: string;
    seo?: ShopifySEO;
    title?: string;
    trackingParameters?: string;
    updatedAt?: string;

    protected static readonly imageClass = ShopifyImage;
    protected static readonly seoClass = ShopifySEO;

    static baseGQL = `
        id
        handle
        onlineStoreUrl
        title
    `;

    static composeGQL(includeProducts: boolean): string {
        let query = `
            ${this.baseGQL}
            description
            descriptionHtml
            image {
                ${this.imageClass.gql}
            }
            seo{
                ${this.seoClass.gql}
            }
            trackingParameters
            updatedAt
        `;

        /**@todo - add products to query when products are developed */
        if (includeProducts) {
            query = `
                ${query}
            `;
        }

        return query;
    }

    static composeMenuGQL() {
        return this.baseGQL;
    }
}

export class ShopifyCollectionResultSet extends ShopifyResultSet {
    edges?: { cursor?: string; node?: ShopifyCollection }[];

    protected static readonly collectionClass = ShopifyCollection;

    static composeGQL(includeProducts: boolean) {
        return super.composeResultSetSchema(this.collectionClass.composeGQL(includeProducts), true);
    }
}

export interface ShopifyCollectionInput {
    id: string;
    handle: string;
}

export interface ShopifyCollectionResultSetInput extends ShopifyResultSetInput { }

export class ShopifyColletionQuery {
    protected static readonly collectionClass = ShopifyCollection;
    protected static readonly collectionResultSetClass = ShopifyCollectionResultSet;

    static getCollection = (includeProducts: boolean): GraphqlDatasourceQuery => {
        return {
            queryId: 'collection',
            query: `query Collection($id:ID, $handle:String) {
                collection(id:$id, handle:$handle) {
                    ${this.collectionClass.composeGQL(includeProducts)}
                }
            }`,
        };
    };

    static getCollections = (includeProducts: boolean): GraphqlDatasourceQuery => {
        return {
            queryId: 'collections',
            query: `query Collections($first: Int, $after: String) {
                collections(first: $first, after: $after) {
                    ${this.collectionResultSetClass.composeGQL(includeProducts)}
                }
            }`,
        };
    };
}
