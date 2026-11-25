import { ErrorType } from '@error';
import { HttpException } from '@nestjs/common';
import { TutorialPetErrors, TutorialPetErrorsType } from '@feature-tutorial-pet/common/tutorial-pet.error';

export interface PharmacyErrorsType extends TutorialPetErrorsType {
    getPharmaciesFailed: ErrorType;
    getPharmacyFailed: ErrorType;
    createPharmacyFailed: ErrorType;
    updatePharmacyFailed: ErrorType;
    deletePharmacyFailed: ErrorType;
    pharmacyExists: ErrorType;
    pharmacyNotEditable: ErrorType;
}

export class PharmacyErrors extends TutorialPetErrors {
    protected static errors: PharmacyErrorsType = {
        ...TutorialPetErrors.errors,
        getPharmaciesFailed: {
            code: 'PHARMACIES_GET_FAILED',
            message: 'Get pharmacies failed',
            statusCode: 400,
        },
        getPharmacyFailed: {
            code: 'PHARMACY_GET_FAILED',
            message: 'Get pharmacy failed',
            statusCode: 400,
        },
        createPharmacyFailed: {
            code: 'PHARMACY_CREATE_FAILED',
            message: 'Create pharmacy failed',
            statusCode: 400,
        },
        updatePharmacyFailed: {
            code: 'PHARMACY_UPDATE_FAILED',
            message: 'Update pharmacy failed',
            statusCode: 400,
        },
        deletePharmacyFailed: {
            code: 'PHARMACY_DELETE_FAILED',
            message: 'Delete pharmacy failed',
            statusCode: 400,
        },
        pharmacyExists: {
            code: 'PHARMACY_EXISTS',
            message: 'Pharmacy already exists',
            statusCode: 400,
        },
        pharmacyNotEditable: {
            code: 'PHARMACY_NOT_EDITABLE',
            message: 'Pharmacy not editable',
            statusCode: 400,
        },
    };

    static getPharmaciesFailed(): HttpException {
        return this.composeHTTPError(this.errors.getPharmaciesFailed);
    }

    static getPharmacyFailed(): HttpException {
        return this.composeHTTPError(this.errors.getPharmacyFailed);
    }

    static createPharmacyFailed(): HttpException {
        return this.composeHTTPError(this.errors.createPharmacyFailed);
    }

    static updatePharmacyFailed(): HttpException {
        return this.composeHTTPError(this.errors.updatePharmacyFailed);
    }

    static deletePharmacyFailed(): HttpException {
        return this.composeHTTPError(this.errors.deletePharmacyFailed);
    }

    static pharmacyExists(): HttpException {
        return this.composeHTTPError(this.errors.pharmacyExists);
    }

    static pharmacyNotEditable(): HttpException {
        return this.composeHTTPError(this.errors.pharmacyNotEditable);
    }
}
