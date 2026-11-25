import { ErrorType } from '@error';
import { FeatureErrors, FeatureErrorsType } from '@feature/error';
import { HttpException } from '@nestjs/common';

export interface RegionErrorsType extends FeatureErrorsType {
    getCountriesFailed: ErrorType;
    getCountryFailed: ErrorType;
    getStatesFailed: ErrorType;
    getStateFailed: ErrorType;
}

export class RegionErrors extends FeatureErrors {
    protected static errors: RegionErrorsType = {
        ...FeatureErrors.errors,
        getCountriesFailed: {
            code: 'REGION_COUNTRIES_GET_FAILED',
            message: 'Get countries failed',
            statusCode: 400,
        },

        getCountryFailed: {
            code: 'REGION_COUNTRY_GET_FAILED',
            message: 'Get countries failed',
            statusCode: 400,
        },

        getStatesFailed: {
            code: 'REGION_STATES_GET_FAILED',
            message: 'Get states failed',
            statusCode: 400,
        },

        getStateFailed: {
            code: 'REGION_STATE_GET_FAILED',
            message: 'Get state failed',
            statusCode: 400,
        }
    };

    static getCountriesFailed(): HttpException {
        return this.composeHTTPError(this.errors.getCountriesFailed);
    }

    static getCountryFailed(): HttpException {
        return this.composeHTTPError(this.errors.getCountryFailed);
    }

    static getStatesFailed(): HttpException {
        return this.composeHTTPError(this.errors.getStatesFailed);
    }

    static getStateFailed(): HttpException {
        return this.composeHTTPError(this.errors.getStateFailed);
    }
}
