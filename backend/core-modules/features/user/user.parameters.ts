import { RequestParameterDefinition, RequestParameters, RequestParametersType } from "@api-parameters";

export interface UserRequestParametersType extends RequestParametersType {
    user: RequestParameterDefinition;
    usernames: RequestParameterDefinition;
}

export const UserRequestParameters: UserRequestParametersType = {
    ...RequestParameters,
    user: {
        id: 'user',
        description: 'user',
    },
    usernames: {
        id: 'usernames',
        description: 'user names',
    },
    identifier: {
        id: 'identifier',
        description: 'User identifier - set to @current for the current user associated to the token',
    },
};
