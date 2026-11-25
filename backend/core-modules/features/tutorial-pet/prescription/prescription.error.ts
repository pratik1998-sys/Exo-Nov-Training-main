import { ErrorType } from '@error';
import { HttpException } from '@nestjs/common';
import { TutorialPetErrors, TutorialPetErrorsType } from '@feature-tutorial-pet/common/tutorial-pet.error';

export interface PrescriptionErrorsType extends TutorialPetErrorsType {
    getPrescriptionsFailed: ErrorType;
    getPrescriptionFailed: ErrorType;
    createPrescriptionFailed: ErrorType;
    updatePrescriptionFailed: ErrorType;
    deletePrescriptionFailed: ErrorType;
    prescriptionExists: ErrorType;
    prescriptionNotEditable: ErrorType;
}

export class PrescriptionErrors extends TutorialPetErrors {
    protected static errors: PrescriptionErrorsType = {
        ...TutorialPetErrors.errors,
        getPrescriptionsFailed: {
            code: 'PRESCRIPTIONS_GET_FAILED',
            message: 'Get pharmacies failed',
            statusCode: 400,
        },
        getPrescriptionFailed: {
            code: 'PRESCRIPTION_GET_FAILED',
            message: 'Get pharmacy failed',
            statusCode: 400,
        },
        createPrescriptionFailed: {
            code: 'PRESCRIPTION_CREATE_FAILED',
            message: 'Create pharmacy failed',
            statusCode: 400,
        },
        updatePrescriptionFailed: {
            code: 'PRESCRIPTION_UPDATE_FAILED',
            message: 'Update pharmacy failed',
            statusCode: 400,
        },
        deletePrescriptionFailed: {
            code: 'PRESCRIPTION_DELETE_FAILED',
            message: 'Delete pharmacy failed',
            statusCode: 400,
        },
        prescriptionExists: {
            code: 'PRESCRIPTION_EXISTS',
            message: 'Prescription already exists',
            statusCode: 400,
        },
        prescriptionNotEditable: {
            code: 'PRESCRIPTION_NOT_EDITABLE',
            message: 'Prescription not editable',
            statusCode: 400,
        },
        prescriptionCreateMissingField: {
            code: 'PRESCRIPTION_CREATE_MISSING_FIELD',
            message: 'Prescription create missing field',
            statusCode: 400,
        },
    };

    static getPrescriptionsFailed(): HttpException {
        return this.composeHTTPError(this.errors.getPrescriptionsFailed);
    }

    static getPrescriptionFailed(): HttpException {
        return this.composeHTTPError(this.errors.getPrescriptionFailed);
    }

    static createPrescriptionFailed(): HttpException {
        return this.composeHTTPError(this.errors.createPrescriptionFailed);
    }

    static updatePrescriptionFailed(): HttpException {
        return this.composeHTTPError(this.errors.updatePrescriptionFailed);
    }

    static deletePrescriptionFailed(): HttpException {
        return this.composeHTTPError(this.errors.deletePrescriptionFailed);
    }

    static prescriptionExists(): HttpException {
        return this.composeHTTPError(this.errors.physicianExists);
    }

    static prescriptionNotEditable(): HttpException {
        return this.composeHTTPError(this.errors.prescriptionNotEditable);
    }

    static prescriptionCreateMissingField(): HttpException {
        return this.composeHTTPError(this.errors.prescriptionCreateMissingField);
    }
}
