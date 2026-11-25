import { ErrorType } from '@error';
import { HttpException } from '@nestjs/common';
import { TutorialPetErrors, TutorialPetErrorsType } from '@feature-tutorial-pet/common/tutorial-pet.error';

export interface VeterinarianErrorsType extends TutorialPetErrorsType {
    getVeterinariansFailed: ErrorType;
    getVeterinarianFailed: ErrorType;
    createVeterinarianFailed: ErrorType;
    updateVeterinarianFailed: ErrorType;
    deleteVeterinarianFailed: ErrorType;
    veterinarianExists: ErrorType;
    veterinarianNotEditable: ErrorType;
}
export class VeterinarianErrors extends TutorialPetErrors {
    protected static errors: VeterinarianErrorsType = {
        ...TutorialPetErrors.errors,
        getVeterinariansFailed: {
            code: 'VETERINARIANS_GET_FAILED',
            message: 'Get pharmacies failed',
            statusCode: 400,
        },
        getVeterinarianFailed: {
            code: 'VETERINARIAN_GET_FAILED',
            message: 'Get pharmacy failed',
            statusCode: 400,
        },
        createVeterinarianFailed: {
            code: 'VETERINARIAN_CREATE_FAILED',
            message: 'Create pharmacy failed',
            statusCode: 400,
        },
        updateVeterinarianFailed: {
            code: 'VETERINARIAN_UPDATE_FAILED',
            message: 'Update pharmacy failed',
            statusCode: 400,
        },
        deleteVeterinarianFailed: {
            code: 'VETERINARIAN_DELETE_FAILED',
            message: 'Delete pharmacy failed',
            statusCode: 400,
        },
        veterinarianExists: {
            code: 'VETERINARIAN_EXISTS',
            message: 'Veterinarian already exists',
            statusCode: 400,
        },
        veterinarianNotEditable: {
            code: 'VETERINARIAN_NOT_EDITABLE',
            message: 'Veterinarian not editable',
            statusCode: 400,
        },
    };

    static getVeterinariansFailed(): HttpException {
        return this.composeHTTPError(this.errors.getVeterinariansFailed);
    }

    static getVeterinarianFailed(): HttpException {
        return this.composeHTTPError(this.errors.getVeterinarianFailed);
    }

    static createVeterinarianFailed(): HttpException {
        return this.composeHTTPError(this.errors.createVeterinarianFailed);
    }

    static updateVeterinarianFailed(): HttpException {
        return this.composeHTTPError(this.errors.updateVeterinarianFailed);
    }

    static deleteVeterinarianFailed(): HttpException {
        return this.composeHTTPError(this.errors.deleteVeterinarianFailed);
    }

    static veterinarianExists(): HttpException {
        return this.composeHTTPError(this.errors.veterinarianExists);
    }

    static veterinarianNotEditable(): HttpException {
        return this.composeHTTPError(this.errors.veterinarianNotEditable);
    }
}
