import { ApiConfiguration, ApiOperationDefinition, ApiOperationOptions } from "@api";
import { User, UserInput, UserRequestParameters } from "@feature-user";

export interface ECUserApiOperations {
    user: ApiOperationDefinition;
    userCreate: ApiOperationDefinition;
    userUpdate: ApiOperationDefinition;
}

export class ECUserApiConfiguration extends ApiConfiguration {
    static operations: ECUserApiOperations = {
        user: {
            id: 'user',
            description: 'Get user - if identifier present and have permissions, will return user with that identifier. If no identifier, will return the current user',
            summary: 'Get user',
            restOptions: {
                isById: true,
                path: `:${UserRequestParameters.identifier.id}`,
                apiOkResponseOptions: {
                    type: User,
                },
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
        userCreate: {
            id: 'userCreate',
            description: 'Create user',
            summary: 'Create user',
            restOptions: {
                apiOkResponseOptions: {
                    type: User,
                },
                apiBodyOptions: {
                    type: UserInput,
                },
                tags: [],
            },
            mutationOptions: {
                required: false,
            },
        },
        userUpdate: {
            id: 'userUpdate',
            description: 'Update user',
            summary: 'Update user',
            restOptions: {
                apiOkResponseOptions: {
                    type: User,
                },
                apiBodyOptions: {
                    type: UserInput,
                },
                tags: [],
            },
            mutationOptions: {
                required: false,
            },
        },
    };

    static user(): ApiOperationOptions {
        return this.composeOperationOptions(this.operations.user);
    }

    static userCreate(): ApiOperationOptions {
        return this.composeOperationOptions(this.operations.userCreate);
    }

    static userUpdate(): ApiOperationOptions {
        return this.composeOperationOptions(this.operations.userUpdate);
    }
}
