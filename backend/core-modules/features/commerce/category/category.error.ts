import { ErrorType } from '@error';
import { CommerceErrors, CommerceErrorsType } from '@feature-commerce/common';
import { HttpException } from '@nestjs/common';

export interface CategoryErrorsType extends CommerceErrorsType {
    categoryGetFailed: ErrorType;
    invalidCategoryRequest: ErrorType;
}

export class CategoryErrors extends CommerceErrors {
    static errors: CategoryErrorsType = {
        ...CommerceErrors.errors,
        categoryGetFailed: {
            code: 'CATEGORY_GET_FAILED',
            message: 'Category get failed',
            statusCode: 400,
        },

        invalidCategoryRequest: {
            code: 'CATEGORY_INVALID_REQUEST',
            message: 'Invalid request for category. One of the fields [id, slug] must be present',
            statusCode: 400,
        },
    }

    static categoryGetFailed(): HttpException {
        return this.composeHTTPError(this.errors.categoryGetFailed);
    }

    static invalidCategoryRequest(): HttpException {
        return this.composeHTTPError(this.errors.invalidCategoryRequest);
    }
}
