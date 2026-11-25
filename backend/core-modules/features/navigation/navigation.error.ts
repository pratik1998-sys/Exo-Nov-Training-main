import { ErrorType } from '@error';
import { FeatureErrors, FeatureErrorsType } from '@feature/error';
import { HttpException } from '@nestjs/common';

export interface NavigationErrorsType extends FeatureErrorsType {
    getHeaderFailed: ErrorType;
    getFooterFailed: ErrorType;
}

export class NavigationErrors extends FeatureErrors {
    protected static errors: NavigationErrorsType = {
        ...FeatureErrors.errors,
        getHeaderFailed: {
            code: 'NAVIGATION_GET_HEADER_FAILED',
            message: 'Failed to get header data',
            statusCode: 400,
        },
        getFooterFailed: {
            code: 'NAVIGATION_GET_FOOTER_FAILED',
            message: 'Failed to get footer data',
            statusCode: 400,
        }
    };

    static getHeaderFailed(): HttpException {
        return this.composeHTTPError(this.errors.getHeaderFailed);
    }

    static getFooterFailed(): HttpException {
        return this.composeHTTPError(this.errors.getFooterFailed);
    }
}
