import { Authenticate, AuthenticateGuestInput, AuthenticateInput, LogoutResponse } from './authenticate.model';
import { ApiConfiguration, ApiOperationDefinition, ApiOperationOptions } from '@api';

export interface AuthenticateApiOperations {
    authenticate: ApiOperationDefinition;
    authenticateGuest: ApiOperationDefinition;
    logout: ApiOperationDefinition;
}

export class AuthenticateApiConfiguration extends ApiConfiguration {
    static operations: AuthenticateApiOperations = {
        authenticate: {
            id: 'authenticate',
            description: 'Authenticate the user',
            summary: 'Authenticate the user',
            isAuthRequired: false,
            restOptions: {
                apiOkResponseOptions: {
                    type: Authenticate,
                },
                apiBodyOptions: {
                    type: AuthenticateInput,
                },
                tags: [],
            },
            mutationOptions: {
                required: false,
            },
        },
        authenticateGuest: {
            id: 'authenticateGuest',
            description: 'Authenticate the user as a guest',
            summary: 'Authenticate the user as a guest',
            isAuthRequired: false,
            restOptions: {
                path: 'guest',
                apiOkResponseOptions: {
                    type: Authenticate,
                },
                apiBodyOptions: {
                    type: AuthenticateGuestInput,
                },
                tags: [],
            },
            mutationOptions: {
                required: false,
            },
        },
        logout: {
            id: 'logout',
            description: 'Clear the auth token cookie',
            summary: 'Logout',
            isAuthRequired: false,
            restOptions: {
                path: 'logout',
                apiOkResponseOptions: {
                    type: LogoutResponse,
                },
                tags: [],
            },
            mutationOptions: {
                required: false,
            },
        },
    };

    static authenticate(): ApiOperationOptions {
        return this.composeOperationOptions(this.operations.authenticate);
    }

    static authenticateGuest(): ApiOperationOptions {
        return this.composeOperationOptions(this.operations.authenticateGuest);
    }

    static logout(): ApiOperationOptions {
        return this.composeOperationOptions(this.operations.logout);
    }
}
