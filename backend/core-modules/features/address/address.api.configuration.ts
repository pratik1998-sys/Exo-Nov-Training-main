import { Address, AddressInput, AddressResultSet } from './address.model';
import { AddressRequestParameters } from './address.parameters';
import { ApiConfiguration, ApiOperationDefinition, ApiOperationOptions } from '@api';

export interface AddressApiOperations {
    addresses: ApiOperationDefinition;
    address: ApiOperationDefinition;
    addressCreate: ApiOperationDefinition;
    addressUpdate: ApiOperationDefinition;
    addressDelete: ApiOperationDefinition;
}

export class AddressApiConfiguration extends ApiConfiguration {
    static operations: AddressApiOperations = {
        addresses: {
            id: 'addresses',
            description: 'Get addresses',
            summary: 'Get addresses',
            isAuthRequired: true,
            restOptions: {
                apiOkResponseOptions: {
                    type: AddressResultSet,
                },
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
        address: {
            id: 'address',
            description: 'Get address',
            summary: 'Get address',
            isAuthRequired: true,
            restOptions: {
                isById: true,
                path: `:${AddressRequestParameters.id.id}`,
                apiOkResponseOptions: {
                    type: Address,
                },
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
        addressCreate: {
            id: 'addressCreate',
            description: 'Create address',
            summary: 'Create address',
            isAuthRequired: true,
            restOptions: {
                apiOkResponseOptions: {
                    type: Address,
                },
                apiBodyOptions: {
                    type: AddressInput,
                },
                tags: [],
            },
            mutationOptions: {
                required: false,
            },
        },
        addressUpdate: {
            id: 'addressUpdate',
            description: 'Update address',
            summary: 'Update address',
            isAuthRequired: true,
            restOptions: {
                path: `:${AddressRequestParameters.id.id}`,
                apiOkResponseOptions: {
                    type: Address,
                },
                apiBodyOptions: {
                    type: AddressInput,
                },
                tags: [],
            },
            mutationOptions: {
                required: false,
            },
        },
        addressDelete: {
            id: 'addressDelete',
            description: 'Delete address',
            summary: 'Delete address',
            isAuthRequired: true,
            restOptions: {
                path: `:${AddressRequestParameters.id.id}`,
                apiOkResponseOptions: {
                    type: Address,
                },
                tags: [],
            },
            mutationOptions: {
                required: false,
            },
        },
    };

    static addresses(): ApiOperationOptions {
        return this.composeOperationOptions(AddressApiConfiguration.operations.addresses);
    }

    static address(): ApiOperationOptions {
        return this.composeOperationOptions(AddressApiConfiguration.operations.address);
    }

    static addressCreate(): ApiOperationOptions {
        return this.composeOperationOptions(AddressApiConfiguration.operations.addressCreate);
    }

    static addressUpdate(): ApiOperationOptions {
        return this.composeOperationOptions(AddressApiConfiguration.operations.addressUpdate);
    }

    static addressDelete(): ApiOperationOptions {
        return this.composeOperationOptions(AddressApiConfiguration.operations.addressDelete);
    }
}
