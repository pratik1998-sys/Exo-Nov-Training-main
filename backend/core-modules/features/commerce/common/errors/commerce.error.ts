
import { ErrorType } from '@error';
import { FeatureErrors, FeatureErrorsType } from '@feature/error';
import { HttpException } from '@nestjs/common';

export interface CommerceErrorsType extends FeatureErrorsType {
    customerNotLoggedIn: ErrorType;
}

export class CommerceErrors extends FeatureErrors {
    protected static errors: CommerceErrorsType = {
        ...FeatureErrors.errors,
        customerNotLoggedIn: {
            code: 'CUSTOMER_NOT_LOGGED_IN',
            message: 'Customer not logged in',
            statusCode: 400,
        },
    };

    static customerNotLoggedIn(): HttpException {
        return this.composeHTTPError(this.errors.customerNotLoggedIn);
    }
}
