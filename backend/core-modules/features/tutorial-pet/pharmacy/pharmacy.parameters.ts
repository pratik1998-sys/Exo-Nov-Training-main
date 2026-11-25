import { RequestParameterDefinition, RequestParameters, RequestParametersType } from '@api-parameters';

export interface PharmacyRequestParametersType extends RequestParametersType {
    pharmacy: RequestParameterDefinition;
}

export const PharmacyRequestParameters: PharmacyRequestParametersType = {
    ...RequestParameters,
    pharmacy: {
        id: 'pharmacy',
        description: 'pharmacy',
    },
};
