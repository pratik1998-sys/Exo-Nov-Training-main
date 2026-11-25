import { ApiConfiguration, ApiOperationDefinition, ApiOperationOptions } from "@api";
import { Category, CategoryResultSet } from "./category.model";
import { CategoryRequestParameters } from "./category.parameters";

export interface CategoryApiOperations {
    category: ApiOperationDefinition;
    categories: ApiOperationDefinition;
}

export class CategoryApiConfiguration extends ApiConfiguration {
    static operations: CategoryApiOperations = {
        category: {
            id: 'category',
            description: 'Get a category by id, identifier, or slug',
            summary: 'Get a category by id, identifier, or slug',
            isAuthRequired: false,
            restOptions: {
                isById: true,
                path: `/:${CategoryRequestParameters.identifier.id}`,
                apiOkResponseOptions: {
                    type: Category,
                },
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
        categories: {
            id: 'categories',
            description: 'Get categories',
            summary: 'Get categories',
            isAuthRequired: false,
            restOptions: {
                apiOkResponseOptions: {
                    type: CategoryResultSet,
                },
            },
            queryOptions: {
                required: false,
            },
        },
    };

    static category(): ApiOperationOptions {
        return this.composeOperationOptions(this.operations.category);
    }

    static categories(): ApiOperationOptions {
        return this.composeOperationOptions(this.operations.categories);
    }
}
