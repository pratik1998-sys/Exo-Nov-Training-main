
import { HttpException } from '@nestjs/common';
import { ErrorType } from '@error/error';
import { CategoryErrors, CategoryErrorsType } from '@feature-commerce/category';

export interface HCLCommerceCategoryErrorType extends CategoryErrorsType {
    invalidCategoryRequest: ErrorType;
}

export class HCLCommerceCategoryErrors extends CategoryErrors {
    static errors: HCLCommerceCategoryErrorType = {
        ...CategoryErrors.errors,
        invalidCategoryRequest: {
            code: 'CATEGORY_INVALID_REQUEST',
            message: 'Invalid request for category. Id is required',
            statusCode: 400,
        },
    };

    static invalidCategoryRequest(): HttpException {
        return this.composeHTTPError(this.errors.invalidCategoryRequest);
    }
}
