import { BaseErrors, ErrorsType, ErrorType } from '@error';
import { HttpException } from '@nestjs/common';

export interface ShopifyBaseErrorsType extends ErrorsType {
    maxDepthExceeded: ErrorType;
}

export class ShopifyBaseErrors extends BaseErrors {
    protected static errors: ShopifyBaseErrorsType = {
        maxDepthExceeded: {
            code: 'EXO_MAX_DEPTH_EXCEEDED',
            message: 'Max depth exceeded',
            statusCode: 400,
        },
    };

    static maxDepthExceeded(): HttpException {
        return this.composeHTTPError(this.errors.maxDepthExceeded);
    }
}
