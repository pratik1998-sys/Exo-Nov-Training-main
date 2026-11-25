import { ErrorType } from '@error';
import { FeatureErrors, FeatureErrorsType } from '@feature/error';
import { HttpException } from '@nestjs/common';

export interface UILayoutErrorsType extends FeatureErrorsType {
    getLayoutFailed: ErrorType;
}

export class UILayoutErrors extends FeatureErrors {
    protected static errors: UILayoutErrorsType = {
        ...FeatureErrors.errors,
        getLayoutFailed: {
            code: 'UI_LAYOUT_GET_FAILED',
            message: 'Failed to get UI layout',
            statusCode: 400,
        },
    };

    static getLayoutFailed(): HttpException {
        return this.composeHTTPError(this.errors.getLayoutFailed);
    }
}
