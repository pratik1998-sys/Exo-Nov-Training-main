import { ApiConfiguration, ApiOperationDefinition, ApiOperationOptions } from "@api";
import { Product, ProductResultSet, ProductsGetInput } from "./product.model";
import { ProductRequestParameters } from "./product.parameters";

export interface ProductApiOperations {
    product: ApiOperationDefinition;
    products: ApiOperationDefinition;
    productsPost: ApiOperationDefinition;
}

export class ProductApiConfiguration extends ApiConfiguration {
    static operations: ProductApiOperations = {
        product: {
            id: 'product',
            description: 'Get product',
            summary: 'Get product',
            isAuthRequired: false,
            restOptions: {
                isById: true,
                path: `:${ProductRequestParameters.identifier.id}`,
                apiOkResponseOptions: {
                    type: Product,
                },
                apiQueryOptions: [{ parameter: ProductRequestParameters.idType, required: false }],
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
        products: {
            id: 'products',
            description: 'Get products',
            summary: 'Get products',
            isAuthRequired: false,
            restOptions: {
                apiOkResponseOptions: {
                    type: ProductResultSet,
                },
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
        productsPost: {
            id: 'productsPost',
            description: 'Get products',
            summary: 'Get products',
            isAuthRequired: false,
            restOptions: {
                apiOkResponseOptions: {
                    type: ProductResultSet,
                },
                apiBodyOptions: {
                    type: ProductsGetInput,
                },
                tags: [],
            },
        },
    };

    static product(): ApiOperationOptions {
        return this.composeOperationOptions(this.operations.product);
    }

    static products(): ApiOperationOptions {
        return this.composeOperationOptions(this.operations.products);
    }

    static productsPost(): ApiOperationOptions {
        return this.composeOperationOptions(this.operations.productsPost);
    }
}
