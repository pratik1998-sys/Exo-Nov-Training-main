import { ErrorType } from '@error';
import { FeatureErrors, FeatureErrorsType } from '@feature/error';
import { HttpException } from '@nestjs/common';

export interface UserErrorsType extends FeatureErrorsType {
    getUsersFailed: ErrorType;
    getUserFailed: ErrorType;
    createUserFailed: ErrorType;
    updateUserFailed: ErrorType;
    deleteUserFailed: ErrorType;
    userExists: ErrorType;
    userNotEditable: ErrorType;
}

export class UserErrors extends FeatureErrors {
    protected static errors: UserErrorsType = {
        ...FeatureErrors.errors,
        getUsersFailed: {
            code: 'USERS_GET_FAILED',
            message: 'Get users failed',
            statusCode: 400,
        },
        getUserFailed: {
            code: 'USER_GET_FAILED',
            message: 'Get user failed',
            statusCode: 400,
        },
        createUserFailed: {
            code: 'USER_CREATE_FAILED',
            message: 'Create user failed',
            statusCode: 400,
        },
        updateUserFailed: {
            code: 'USER_UPDATE_FAILED',
            message: 'Update user failed',
            statusCode: 400,
        },
        deleteUserFailed: {
            code: 'USER_DELETE_FAILED',
            message: 'Delete user failed',
            statusCode: 400,
        },
        userExists: {
            code: 'USER_EXISTS',
            message: 'User alread exists',
            statusCode: 400,
        },
        userNotEditable: {
            code: 'USER_NOT_EDITABLE',
            message: 'User not editable',
            statusCode: 400,
        },
    };

    static getUsersFailed(): HttpException {
        return this.composeHTTPError(this.errors.getUsersFailed);
    }

    static getUserFailed(): HttpException {
        return this.composeHTTPError(this.errors.getUserFailed);
    }

    static createUserFailed(): HttpException {
        return this.composeHTTPError(this.errors.createUserFailed);
    }

    static updateUserFailed(): HttpException {
        return this.composeHTTPError(this.errors.updateUserFailed);
    }

    static deleteUserFailed(): HttpException {
        return this.composeHTTPError(this.errors.deleteUserFailed);
    }

    static userExists(): HttpException {
        return this.composeHTTPError(this.errors.userExists);
    }

    static userNotEditable(): HttpException {
        return this.composeHTTPError(this.errors.userNotEditable);
    }
}
