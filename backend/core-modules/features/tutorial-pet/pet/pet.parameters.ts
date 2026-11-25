import { RequestParameterDefinition, RequestParameters, RequestParametersType } from '@api-parameters';

export interface PetRequestParametersType extends RequestParametersType {
    pet: RequestParameterDefinition;
    userIdentifier: RequestParameterDefinition;
}

export const PetRequestParameters: PetRequestParametersType = {
    ...RequestParameters,
    pet: {
        id: 'pet',
        description: 'pet',
    },
    userIdentifier: {
        id: 'userIdentifier',
        description: 'userIdentifier',
    },
};
