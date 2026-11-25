import { RequestParameterDefinition, RequestParameters, RequestParametersType } from '@api-parameters';

export interface ContactRequestParametersType extends RequestParametersType {
    contact: RequestParameterDefinition;
}

export const ContactRequestParameters: ContactRequestParametersType = {
    ...RequestParameters,
    contact: {
        id: 'contact',
        description: 'contact',
    },
};
