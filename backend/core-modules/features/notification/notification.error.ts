import { HttpException } from '@nestjs/common';
import { FeatureErrors, FeatureErrorsType } from '@feature/error';
import { ErrorType } from '@error';

export interface NotificationErrorsType extends FeatureErrorsType {
    getNotificationsFailed: ErrorType;
}

export class NotificationErrors extends FeatureErrors {
    protected static errors: NotificationErrorsType = {
        ...FeatureErrors.errors,
        getNotificationsFailed: {
            code: 'NOTIFICATION_GET_FAILED',
            message: 'Failed to get notifications',
            statusCode: 400,
        },
    };

    static getNotificationsFailed(): HttpException {
        return this.composeHTTPError(this.errors.getNotificationsFailed);
    }
}
