import { RequestParameterDefinition, RequestParameters, RequestParametersType } from "@api-parameters";

export interface AddressRequestParametersType extends RequestParametersType {
    address: RequestParameterDefinition;
}

export const AddressRequestParameters: AddressRequestParametersType = {
    ...RequestParameters,
    address: {
        id: 'address',
        description: 'address input',
    },
};
