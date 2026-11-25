import { RequestParameterDefinition, RequestParameters, RequestParametersType } from '@api-parameters';

export interface VeterinarianRequestParametersType extends RequestParametersType {
    veterinarian: RequestParameterDefinition;
}

export const VeterinarianRequestParameters: VeterinarianRequestParametersType = {
    ...RequestParameters,
    veterinarian: {
        id: 'veterinarian',
        description: 'veterinarian',
    },
};
