import { ErrorType } from '@error/error';
import { CommerceErrors, CommerceErrorsType } from '@feature-commerce/common';
import { HttpException } from '@nestjs/common';

export interface ProductErrorsType extends CommerceErrorsType {
    getProductsFailed: ErrorType;
    getProductFailed: ErrorType;
    invalidGetProductRequest: ErrorType;
    invalidGetProductsRequest: ErrorType;
    productsPageSizeExceedsMax: ErrorType;
}

export class ProductErrors extends CommerceErrors {
    protected static errors: ProductErrorsType = {
        ...CommerceErrors.errors,
        getProductsFailed: {
            code: 'PRODUCTS_GET_FAILED',
            message: 'Get products failed',
            statusCode: 400,
        },
        getProductFailed: {
            code: 'PRODUCT_GET_FAILED',
            message: 'Get product failed',
            statusCode: 400,
        },
        invalidGetProductRequest: {
            code: 'PRODUCT_GET_INVALID_REQUEST',
            message: 'Invalid get product request',
            statusCode: 400,
        },
        invalidGetProductsRequest: {
            code: 'PRODUCTS_GET_INVALID_REQUEST',
            message: 'Invalid get products request',
            statusCode: 400,
        },
        productsPageSizeExceedsMax: {
            code: 'PRODUCTS_PAGINATION_PAGE_SIZE_EXCEEDS_MAX',
            message: 'Request page size exceeds max',
            statusCode: 400,
        }
    };

    static getProductsFailed(): HttpException {
        return this.composeHTTPError(this.errors.getProductsFailed);
    }

    static getProductFailed(): HttpException {
        return this.composeHTTPError(this.errors.getProductFailed);
    }

    static invalidGetProductRequest(): HttpException {
        return this.composeHTTPError(this.errors.invalidGetProductRequest);
    }

    static invalidGetProductsRequest(): HttpException {
        return this.composeHTTPError(this.errors.invalidGetProductsRequest);
    }

    static productsPageSizeExceedsMax(): HttpException {
        return this.composeHTTPError(this.errors.productsPageSizeExceedsMax);
    }
}
