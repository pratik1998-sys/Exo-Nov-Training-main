import { ECAuthenticate, ECAuthenticateGuestInput, ECAuthenticateInput } from './ec-authenticate.model';
import { ApiConfiguration, ApiOperationDefinition, ApiOperationOptions } from '@api';

export interface ECAuthenticateApiOperations {
    authenticate: ApiOperationDefinition;
    authenticateGuest: ApiOperationDefinition;
}
export class ECAuthenticateApiConfiguration extends ApiConfiguration {
    static operations: ECAuthenticateApiOperations = {
        authenticate: {
            id: 'authenticate',
            description: 'Authenticate the user',
            summary: 'Authenticate the user',
            isAuthRequired: false,
            mutationOptions: {
                required: false,
            },
            restOptions: {
                apiOkResponseOptions: {
                    type: ECAuthenticate,
                },
                apiBodyOptions: {
                    type: ECAuthenticateInput,
                },
            },
        },
        authenticateGuest: {
            id: 'authenticateGuest',
            description: 'Authenticate the user as a guest (no associated account)',
            summary: 'Authenticate the user as a guest (no associated account)',
            isAuthRequired: false,
            restOptions: {
                path: 'guest',
                apiOkResponseOptions: {
                    type: ECAuthenticate,
                },
                apiBodyOptions: {
                    type: ECAuthenticateGuestInput,
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
}
