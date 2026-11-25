import { RequestParameterDefinition, RequestParameters, RequestParametersType } from '@api-parameters';

export interface CommerceRequestParametersType extends RequestParametersType {
    idType: RequestParameterDefinition;
    cartId: RequestParameterDefinition;
    isDetailed: RequestParameterDefinition;
}

export const CommerceRequestParameters: CommerceRequestParametersType = {
    ...RequestParameters,
    idType: {
        id: 'idType',
        description: 'Type of identifier used to identify entity in the request',
    },
    cartId: {
        id: 'cartId',
        description: 'Cart Id',
    },
    isDetailed: {
        id: 'isDetailed',
        description: 'Flag to enable extra logic for a more detail rich response',
    },
};
