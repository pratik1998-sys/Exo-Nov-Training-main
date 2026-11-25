
import { ApiConfiguration, ApiOperationDefinition, ApiOperationOptions } from '@api';
import { User, UserCreateInput, UserInput, UserRequestParameters, UserResultSet } from '@feature-user';

export interface UserApiOperations {
    users: ApiOperationDefinition;
    user: ApiOperationDefinition;
    userCreate: ApiOperationDefinition;
    userUpdate: ApiOperationDefinition;
    userDelete: ApiOperationDefinition;
}
export class UserApiConfiguration extends ApiConfiguration {
    static operations: UserApiOperations = {
        users: {
            id: 'users',
            description: 'Get user result set',
            summary: 'Get user result set',
            restOptions: {
                apiOkResponseOptions: {
                    type: UserResultSet,
                },
                tags: [],
            },
            queryOptions: {},
        },
        user: {
            id: 'user',
            description: 'Get user by identifier',
            summary: 'Get user by identifier',
            restOptions: {
                isById: true,
                idPathParameter: UserRequestParameters.identifier,
                apiOkResponseOptions: {
                    type: User,
                },
                tags: [],
            },
            queryOptions: {},
        },
        userCreate: {
            id: 'userCreate',
            description: 'Create user',
            summary: 'Create user',
            isAuthRequired: false,
            restOptions: {
                apiOkResponseOptions: {
                    type: User,
                },
                apiBodyOptions: {
                    type: UserCreateInput,
                },
                tags: [],
            },
            queryOptions: {},
        },
        userUpdate: {
            id: 'userUpdate',
            description: 'Update user',
            summary: 'Update user',
            restOptions: {
                isById: true,
                path: `:${UserRequestParameters.identifier.id}`,
                apiOkResponseOptions: {
                    type: User,
                },
                apiBodyOptions: {
                    type: UserInput,
                },
                tags: [],
            },
            queryOptions: {},
        },
        userDelete: {
            id: 'userDelete',
            description: 'Delete user',
            summary: 'Delete user',
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
    };

    static users(): ApiOperationOptions {
        return this.composeOperationOptions(UserApiConfiguration.operations.users);
    }

    static user(): ApiOperationOptions {
        return this.composeOperationOptions(UserApiConfiguration.operations.user);
    }

    static userCreate(): ApiOperationOptions {
        return this.composeOperationOptions(UserApiConfiguration.operations.userCreate);
    }

    static userUpdate(): ApiOperationOptions {
        return this.composeOperationOptions(UserApiConfiguration.operations.userUpdate);
    }

    static userDelete(): ApiOperationOptions {
        return this.composeOperationOptions(UserApiConfiguration.operations.userDelete);
    }
}
