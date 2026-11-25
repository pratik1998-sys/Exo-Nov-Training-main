import { RequestParameterDefinition, RequestParameters, RequestParametersType } from '@api-parameters';

export interface PrescriptionRequestParametersType extends RequestParametersType {
    prescription: RequestParameterDefinition;
}

export const PrescriptionRequestParameters: PrescriptionRequestParametersType = {
    ...RequestParameters,
    prescription: {
        id: 'prescription',
        description: 'prescription',
    },
};
