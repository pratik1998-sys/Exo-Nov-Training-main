import { ErrorType } from '@error';
import { HttpException } from '@nestjs/common';
import { FeatureErrors, FeatureErrorsType } from '@feature/error';

export interface AuthenticateErrorsType extends FeatureErrorsType {
    missingUsername: ErrorType;
    missingPassword: ErrorType;
    authenticateFailed: ErrorType;
}

export class AuthenticateErrors extends FeatureErrors {
    protected static errors: AuthenticateErrorsType = {
        ...FeatureErrors.errors,
        missingUsername: {
            code: 'AUTHENTICATE_MISSING_USERNAME',
            message: 'Missing username',
            statusCode: 400,
        },
        missingPassword: {
            code: 'AUTHENTICATE_MISSING_PASSWORD',
            message: 'Missing username',
            statusCode: 400,
        },
        authenticateFailed: {
            code: 'AUTHENTICATE_FAILED',
            message: 'Authenticate failed',
            statusCode: 400,
        },
    };

    static missingUsername(): HttpException {
        return this.composeHTTPError(this.errors.missingUsername);
    }

    static missingPassword(): HttpException {
        return this.composeHTTPError(this.errors.missingPassword);
    }

    static authenticateFailed(): HttpException {
        return this.composeHTTPError(this.errors.authenticateFailed);
    }
}
