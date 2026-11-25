import { ErrorType } from '@error';
import { FeatureErrors, FeatureErrorsType } from '@feature/error';
import { HttpException } from '@nestjs/common';

export interface AddressErrorsType extends FeatureErrorsType {
    createAddressFailed: ErrorType;
    updateAddressFailed: ErrorType;
    deleteAddressFailed: ErrorType;
    getAddressFailed: ErrorType;
    getAddressesFailed: ErrorType;
    addressNotFound: ErrorType;
}

export class AddressErrors extends FeatureErrors {
    protected static errors: AddressErrorsType = {
        ...FeatureErrors.errors,
        createAddressFailed: {
            code: 'ADDRESS_CREATE_FAILED',
            message: 'Create address failed',
            statusCode: 400,
        },
        updateAddressFailed: {
            code: 'ADDRESS_UPDATE_FAILED',
            message: 'Update address failed',
            statusCode: 400,
        },
        deleteAddressFailed: {
            code: 'ADDRESS_DELETE_FAILED',
            message: 'Delete address failed',
            statusCode: 400,
        },
        getAddressFailed: {
            code: 'ADDRESS_GET_FAILED',
            message: 'Get address failed',
            statusCode: 400,
        },
        getAddressesFailed: {
            code: 'ADDRESS_GET_ADDRESSES_FAILED',
            message: 'Get address failed',
            statusCode: 400,
        },
        addressNotFound: {
            code: 'ADDRESS_NOT_FOUND',
            message: 'Address not found',
            statusCode: 400,
        },
    }

    static createAddressFailed(): HttpException {
        return this.composeHTTPError(this.errors.createAddressFailed);
    }

    static updateAddressFailed(): HttpException {
        return this.composeHTTPError(this.errors.updateAddressFailed);
    }

    static deleteAddressFailed(): HttpException {
        return this.composeHTTPError(this.errors.deleteAddressFailed);
    }

    static getAddressFailed(): HttpException {
        return this.composeHTTPError(this.errors.getAddressFailed);
    }

    static getAddressesFailed(): HttpException {
        return this.composeHTTPError(this.errors.getAddressesFailed);
    }

    static addressNotFound(): HttpException {
        return this.composeHTTPError(this.errors.addressNotFound);
    }
}