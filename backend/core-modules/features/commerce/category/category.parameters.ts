import { RequestParameterDefinition } from '@api-parameters';
import { CommerceRequestParameters, CommerceRequestParametersType } from '@feature-commerce/common';

export interface CategoryRequestParametersType extends CommerceRequestParametersType {
    categoryPagination: RequestParameterDefinition;
    productPagination: RequestParameterDefinition;
    categoryPage: RequestParameterDefinition;
    categoryPageSize: RequestParameterDefinition;
    productPage: RequestParameterDefinition;
    productPageSize: RequestParameterDefinition;
}

export const CategoryRequestParameters: CategoryRequestParametersType = {
    ...CommerceRequestParameters,
    categoryPagination: {
        id: 'categoryPage',
        description: 'Category pagination',
    },
    productPagination: {
        id: 'productPagination',
        description: 'product pagination',
    },
    categoryPage: {
        id: 'categoryPage',
        description: 'Category pagination page',
    },
    categoryPageSize: {
        id: 'categoryPageSize',
        description: 'Category pagination page size',
    },
    productPage: {
        id: 'productPage',
        description: 'Category product pagination page',
    },
    productPageSize: {
        id: 'productPageSize',
        description: 'Category product pagination page size',
    },
};
