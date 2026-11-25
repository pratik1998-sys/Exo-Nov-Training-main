import { RequestParameterDefinition, RequestParameters, RequestParametersType } from "@api-parameters";

export interface AuthenticateRequestParametersType extends RequestParametersType {
    username: RequestParameterDefinition;
    password: RequestParameterDefinition;
    doUser: RequestParameterDefinition;
    additionalAttributes: RequestParameterDefinition;
}

export const AuthenticateRequestParameters: AuthenticateRequestParametersType = {
    ...RequestParameters,
    username: {
        id: 'username',
        description: 'username of user account',
    },
    password: {
        id: 'password',
        description: 'password of user account',
    },
    doUser: {
        id: 'doUser',
        description: 'fetch user details',
    },
    additionalAttributes: {
        id: 'additionalAttributes',
        description: 'additional attributes for implementation',
    },
};
