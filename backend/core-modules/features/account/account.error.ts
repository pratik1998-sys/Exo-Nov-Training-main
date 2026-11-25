import { HttpException } from '@nestjs/common';
import { FeatureErrors, FeatureErrorsType } from '@feature/error';
import { ErrorType } from '@error';

export interface AccountErrorsType extends FeatureErrorsType {
    getAccountFailed: ErrorType;
    getAccountsFailed: ErrorType;
    accountNotFound: ErrorType;
}

export class AccountErrors extends FeatureErrors {
    protected static errors: AccountErrorsType = {
        ...FeatureErrors.errors,
        getAccountFailed: {
            code: 'ACCOUNT_GET_FAILED',
            message: 'Get address failed',
            statusCode: 400,
        },
        getAccountsFailed: {
            code: 'ACCOUNT_GET_ACCOUNTS_FAILED',
            message: 'Get address failed',
            statusCode: 400,
        },
        accountNotFound: {
            code: 'ACCOUNT_NOT_FOUND',
            message: 'Account not found',
            statusCode: 400,
        }
    }
    static getAccountFailed(): HttpException {
        return this.composeHTTPError(this.errors.getAccountFailed);
    }

    static getAccountsFailed(): HttpException {
        return this.composeHTTPError(this.errors.getAccountsFailed);
    }

    static accountNotFound(): HttpException {
        return this.composeHTTPError(this.errors.accountNotFound);
    }
}
