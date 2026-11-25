import { RequestParameterDefinition, RequestParameters, RequestParametersType } from "@api-parameters";

export interface NavigationRequestParametersType extends RequestParametersType {
    navigation: RequestParameterDefinition;
}

export const NavigationRequestParameters: NavigationRequestParametersType = {
    ...RequestParameters,
    navigation: {
        id: 'navigation',
        description: 'navigation',
    },
};