import { ErrorType } from "@error/error";
import { ProductErrors, ProductErrorsType } from "@feature-commerce/product";
import { HttpException } from '@nestjs/common';

export interface CommercetoolsProductErrorsType extends ProductErrorsType {
    productFilterByCategoryIdentifierNotSupported: ErrorType;
    productFilterByCategorySlugNotSupported: ErrorType;
    productFilterBySkuIdNotSupported: ErrorType;
    productFilterBySkuSlugNotSupported: ErrorType;
}


export class CommercetoolsProductErrors extends ProductErrors {
    protected static errors: CommercetoolsProductErrorsType = {
        ...ProductErrors.errors,
        productFilterByCategoryIdentifierNotSupported: {
            code: 'PRODUCTS_FILTER_CATEGORY_IDENTIFIER_NOT_SUPPORTED',
            message: 'Filtering products by category identifier is not supported',
            statusCode: 400,
        },
        productFilterByCategorySlugNotSupported: {
            code: 'PRODUCTS_FILTER_CATEGORY_SLUG_NOT_SUPPORTED',
            message: 'Filtering products by category slug is not supported',
            statusCode: 400,
        },
        productFilterBySkuIdNotSupported: {
            code: 'PRODUCTS_FILTER_SKU_ID_NOT_SUPPORTED',
            message: 'Filtering products by sku id is not supported',
            statusCode: 400,
        },
        productFilterBySkuSlugNotSupported: {
            code: 'PRODUCTS_FILTER_SKU_SLUG_NOT_SUPPORTED',
            message: 'Filtering products by sku slug is not supported',
            statusCode: 400,
        }
    }

    static productFilterByCategorySlugNotSupported(): HttpException {
        return this.composeHTTPError(this.errors.productFilterByCategorySlugNotSupported);
    }

    static productFilterByCategoryIdentifierNotSupported(): HttpException {
        return this.composeHTTPError(this.errors.productFilterByCategoryIdentifierNotSupported);
    }

    static productFilterBySkuIdNotSupported(): HttpException {
        return this.composeHTTPError(this.errors.productFilterBySkuIdNotSupported);
    }

    static productFilterBySkuSlugNotSupported(): HttpException {
        return this.composeHTTPError(this.errors.productFilterBySkuSlugNotSupported);
    }
}
