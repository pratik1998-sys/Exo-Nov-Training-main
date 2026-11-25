import { ErrorType } from '@error/error';
import { ProductErrors, ProductErrorsType } from '@feature-commerce/product';
import { HttpException } from '@nestjs/common';

export interface HCLCommerceProductErrorsType extends ProductErrorsType {
    facetsRequireCategoryOrSearchTerm: ErrorType;
}

export class HCLCommerceProductErrors extends ProductErrors {
    protected static errors: HCLCommerceProductErrorsType = {
        ...ProductErrors.errors,
        facetsRequireCategoryOrSearchTerm: {
            code: 'PRODUCTS_GET_FACETS_REQUIRE_CATEGORY_OR_TERM',
            message: 'Facet filters require a category or search term for this commerce provider',
            statusCode: 400,
        },
    };

    static facetsRequireCategoryOrSearchTerm(): HttpException {
        return this.composeHTTPError(this.errors.facetsRequireCategoryOrSearchTerm);
    }
}
