import { ErrorType } from '@error';
import { TutorialPetErrors, TutorialPetErrorsType } from '@feature-tutorial-pet/common';
import { HttpException } from '@nestjs/common';

export interface PetErrorsType extends TutorialPetErrorsType {
    getPetsFailed: ErrorType;
    getPetFailed: ErrorType;
    createPetFailed: ErrorType;
    updatePetFailed: ErrorType;
    deletePetFailed: ErrorType;
    petExists: ErrorType;
    petNotEditable: ErrorType;
}

export class PetErrors extends TutorialPetErrors {
    protected static errors: PetErrorsType = {
        ...TutorialPetErrors.errors,
        getPetsFailed: {
            code: 'PETS_GET_FAILED',
            message: 'Get pets failed',
            statusCode: 400,
        },
        getPetFailed: {
            code: 'PET_GET_FAILED',
            message: 'Get pet failed',
            statusCode: 400,
        },
        createPetFailed: {
            code: 'PET_CREATE_FAILED',
            message: 'Create pet failed',
            statusCode: 400,
        },
        updatePetFailed: {
            code: 'PET_UPDATE_FAILED',
            message: 'Update pet failed',
            statusCode: 400,
        },
        deletePetFailed: {
            code: 'PET_DELETE_FAILED',
            message: 'Delete pet failed',
            statusCode: 400,
        },
        petExists: {
            code: 'PET_EXISTS',
            message: 'Pet alread exists',
            statusCode: 400,
        },
        petNotEditable: {
            code: 'PET_NOT_EDITABLE',
            message: 'Pet not editable',
            statusCode: 400,
        },
    };

    static getPetsFailed(): HttpException {
        return this.composeHTTPError(this.errors.getPetsFailed);
    }

    static getPetFailed(): HttpException {
        return this.composeHTTPError(this.errors.getPetFailed);
    }

    static createPetFailed(): HttpException {
        return this.composeHTTPError(this.errors.createPetFailed);
    }

    static updatePetFailed(): HttpException {
        return this.composeHTTPError(this.errors.updatePetFailed);
    }

    static deletePetFailed(): HttpException {
        return this.composeHTTPError(this.errors.deletePetFailed);
    }

    static petExists(): HttpException {
        return this.composeHTTPError(this.errors.petExists);
    }

    static petNotEditable(): HttpException {
        return this.composeHTTPError(this.errors.petNotEditable);
    }
}
