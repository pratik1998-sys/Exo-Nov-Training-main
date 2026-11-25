import { ErrorType } from '@error';
import { FeatureErrors, FeatureErrorsType } from '@feature/error/feature.error';
import { HttpException } from '@nestjs/common';

export interface TutorialPetErrorsType extends FeatureErrorsType {
    notAuthorized: ErrorType;
    notEditabled: ErrorType;
}

export class TutorialPetErrors extends FeatureErrors {
    protected static errors: TutorialPetErrorsType = {
        ...FeatureErrors.errors,
        notAuthorized: {
            code: 'TUTORIAL_PET_NOT_AUTHORIZED',
            message: 'Not authorized to execute this service',
            statusCode: 400,
        },
        notEditabled: {
            code: 'TUTORIAL_PET_NOT_EDITABLE',
            message: 'Entity not editable',
            statusCode: 400,
        },
    };

    static notAuthorized(): HttpException {
        return this.composeHTTPError(this.errors.notAuthorized);
    }

    static notEditabled(): HttpException {
        return this.composeHTTPError(this.errors.notEditabled);
    }
}
