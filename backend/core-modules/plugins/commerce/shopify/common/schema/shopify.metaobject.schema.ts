import { GraphqlDatasourceQuery } from '@plugin-datasource-graphql';
import { ShopifyCollection } from '../../features/category/shopify.category.schema';
import { ShopifyMediaImage, ShopifyResultSet } from './shopify.base.schema';

export class ShopifyMetaObject {
    hande?: string;
    id?: string;
    onlineStoreUrl?: string;
    type?: string;
    updatedAt?: string;
    fields?: ShopifyMetaObjectField[];

    protected static getMetaObjectFieldClass() {
        return ShopifyMetaObjectField;
    }

    static composeGQL(includeProducts: boolean, doMetaObjectFields: boolean = true) {
        let query = `    
            handle
            id
            onlineStoreUrl
            type
            updatedAt
            
        `;

        if (doMetaObjectFields) {
            query = `
                ${query}
                fields {
                    ${this.getMetaObjectFieldClass().composeGQL(includeProducts)}
                }
            `;
        }

        return query;
    }
}

export class ShopifyMetaObjectField {
    key?: string;
    type?: string;
    value?: string;
    reference?: ShopifyMediaImage;

    protected static readonly mediaImageClass = ShopifyMediaImage;
    protected static readonly collectionClass = ShopifyCollection;
    protected static readonly metaObjectClass = ShopifyMetaObject;

    static composeGQL(includeProducts: boolean) {
        return `
            key
            type
            value
            reference {
                ... on MediaImage {
                    ${this.mediaImageClass.composeGQL()}
                }
                ... on Collection {
                    ${this.collectionClass.composeGQL(includeProducts)}
                }
                ... on Metaobject {
                    ${this.metaObjectClass.composeGQL(includeProducts, false)}
                }
            }
        `;
    }
}

export interface ShopifyMetaObjectHandleInput {
    handle: string;
    type: string;
}

export interface ShopifyMetaObjectInput {
    id: string;
    handle: ShopifyMetaObjectHandleInput;
}

export class ShopifyMetaObjectResultSet extends ShopifyResultSet {
    edges?: { cursor?: string; node?: ShopifyMetaObject }[];

    protected static readonly metaObjectClass = ShopifyMetaObject;

    static composeGQL(includeProducts: boolean) {
        return super.composeResultSetSchema(this.metaObjectClass.composeGQL(includeProducts), true);
    }
}

export class ShopifyMetaObjectQuery {
    protected static readonly metaObjectClass = ShopifyMetaObject;
    protected static readonly metaObjectResultSetClass = ShopifyMetaObjectResultSet;

    static getMetaObject = (includeProducts: boolean): GraphqlDatasourceQuery => {
        return {
            queryId: 'metaobject',
            query: `query Metaobject($id:ID) {
                metaobject(id:$id) {
                    ${this.metaObjectClass.composeGQL(includeProducts)}
                }
            }`,
        };
    };

    static getMetaObjectByHandle = (includeProducts: boolean): GraphqlDatasourceQuery => {
        return {
            queryId: 'metaobjectByHandle',
            query: `query Metaobject($handle:MetaobjectHandleInput) {
                metaobject(handle:$handle) {
                    ${this.metaObjectClass.composeGQL(includeProducts)}
                }
            }`,
        };
    };

    static getMetaObjects = (includeProducts: boolean): GraphqlDatasourceQuery => {
        return {
            queryId: 'metaobjects',
            query: `query Metaobjects($type:String!, $first: Int, $after: String) {
                metaobjects(type:$type, first: $first, after: $after) {
                    ${this.metaObjectResultSetClass.composeGQL(includeProducts)}
                }
            }`,
        };
    };
}
