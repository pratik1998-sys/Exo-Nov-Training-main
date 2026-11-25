import { RequestParameterDefinition, RequestParametersType } from '@api-parameters';
import { RequestParameters } from '@api-parameters';

export interface RegionRequestParametersType extends RequestParametersType {
    countryIdentifier: RequestParameterDefinition;
    stateIdentifier: RequestParameterDefinition;
}

export const RegionRequestParameters: RegionRequestParametersType = {
    ...RequestParameters,
    countryIdentifier: {
        id: 'countryIdentifier',
        description: 'country identifier',
    },
    stateIdentifier: {
        id: 'stateIdentifier',
        description: 'state identifier',
    },
};
