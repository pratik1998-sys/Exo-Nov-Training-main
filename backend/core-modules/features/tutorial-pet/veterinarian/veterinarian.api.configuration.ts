import { Veterinarian, VeterinarianInput, VeterinarianResultSet } from './veterinarian.model';
import { VeterinarianRequestParameters } from './veterinarian.parameters';
import { ApiConfiguration, ApiOperationDefinition, ApiOperationOptions } from '@api';

export interface VeterinarianApiOperations {
    veterinarians: ApiOperationDefinition;
    veterinarian: ApiOperationDefinition;
    veterinarianCreate: ApiOperationDefinition;
    veterinarianUpdate: ApiOperationDefinition;
    veterinarianDelete: ApiOperationDefinition;
}

export class VeterinarianApiConfiguration extends ApiConfiguration {
    static operations: VeterinarianApiOperations = {
        veterinarians: {
            id: 'veterinarians',
            description: 'Get veterinarian result set',
            summary: 'Get veterinarian result set',
            restOptions: {
                apiOkResponseOptions: {
                    type: VeterinarianResultSet,
                },
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
        veterinarian: {
            id: 'veterinarian',
            description: 'Get veterinarian by identifier',
            summary: 'Get veterinarian by identifier',
            restOptions: {
                isById: true,
                idPathParameter: VeterinarianRequestParameters.identifier,
                // path: `:${VeterinarianRequestParameters.identifier.id}`,
                apiOkResponseOptions: {
                    type: Veterinarian,
                },
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
        veterinarianCreate: {
            id: 'veterinarianCreate',
            description: 'Create veterinarian',
            summary: 'Create veterinarian',
            restOptions: {
                apiOkResponseOptions: {
                    type: Veterinarian,
                },
                apiBodyOptions: {
                    type: VeterinarianInput,
                },
                tags: [],
            },
            mutationOptions: {
                required: false,
            },
        },
        veterinarianUpdate: {
            id: 'veterinarianUpdate',
            description: 'Update veterinarian',
            summary: 'Update veterinarian',
            restOptions: {
                path: `:${VeterinarianRequestParameters.identifier.id}`,
                apiOkResponseOptions: {
                    type: Veterinarian,
                },
                apiBodyOptions: {
                    type: VeterinarianInput,
                },
                tags: [],
            },
            mutationOptions: {
                required: false,
            },
        },
        veterinarianDelete: {
            id: 'veterinarianDelete',
            description: 'Delete veterinarian',
            summary: 'Delete veterinarian',
            restOptions: {
                path: `:${VeterinarianRequestParameters.identifier.id}`,
                apiOkResponseOptions: {
                    type: Veterinarian,
                },
                tags: [],
            },
            mutationOptions: {
                required: false,
            },
        },
    };

    static veterinarians(): ApiOperationOptions {
        return this.composeOperationOptions(VeterinarianApiConfiguration.operations.veterinarians);
    }

    static veterinarian(): ApiOperationOptions {
        return this.composeOperationOptions(VeterinarianApiConfiguration.operations.veterinarian);
    }

    static veterinarianCreate(): ApiOperationOptions {
        return this.composeOperationOptions(VeterinarianApiConfiguration.operations.veterinarianCreate);
    }

    static veterinarianUpdate(): ApiOperationOptions {
        return this.composeOperationOptions(VeterinarianApiConfiguration.operations.veterinarianUpdate);
    }

    static veterinarianDelete(): ApiOperationOptions {
        return this.composeOperationOptions(VeterinarianApiConfiguration.operations.veterinarianDelete);
    }
}
