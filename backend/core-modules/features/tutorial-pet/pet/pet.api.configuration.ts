import { Pet, PetInput, PetResultSet } from './pet.model';
import { PetRequestParameters } from './pet.parameters';
import { ApiConfiguration, ApiOperationDefinition, ApiOperationOptions } from '@api';

export interface PetApiOperations {
    pets: ApiOperationDefinition;
    pet: ApiOperationDefinition;
    petCreate: ApiOperationDefinition;
    petUpdate: ApiOperationDefinition;
    petDelete: ApiOperationDefinition;
}

export class PetApiConfiguration extends ApiConfiguration {
    static operations: PetApiOperations = {
        pets: {
            id: 'pets',
            description: 'Get pet result set',
            summary: 'Get pet result set',
            restOptions: {
                apiOkResponseOptions: {
                    type: PetResultSet,
                },
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
        pet: {
            id: 'pet',
            description: 'Get pet by identifier',
            summary: 'Get pet by identifier',
            restOptions: {
                isById: true,
                idPathParameter: PetRequestParameters.identifier,
                // path: `:${PetRequestParameters.identifier.id}`,
                apiOkResponseOptions: {
                    type: Pet,
                },
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
        petCreate: {
            id: 'petCreate',
            description: 'Create pet',
            summary: 'Create pet',
            restOptions: {
                apiOkResponseOptions: {
                    type: Pet,
                },
                apiBodyOptions: {
                    type: PetInput,
                },
                tags: [],
            },
            mutationOptions: {
                required: false,
            },
        },
        petUpdate: {
            id: 'petUpdate',
            description: 'Update pet',
            summary: 'Update pet',
            restOptions: {
                path: `:${PetRequestParameters.identifier.id}`,
                apiOkResponseOptions: {
                    type: Pet,
                },
                apiBodyOptions: {
                    type: PetInput,
                },
                tags: [],
            },
            mutationOptions: {
                required: false,
            },
        },
        petDelete: {
            id: 'petDelete',
            description: 'Delete pet',
            summary: 'Delete pet',
            restOptions: {
                path: `:${PetRequestParameters.identifier.id}`,
                apiOkResponseOptions: {
                    type: Pet,
                },
                tags: [],
            },
            mutationOptions: {
                required: false,
            },
        },
    };

    static pets(): ApiOperationOptions {
        return this.composeOperationOptions(PetApiConfiguration.operations.pets);
    }

    static pet(): ApiOperationOptions {
        return this.composeOperationOptions(PetApiConfiguration.operations.pet);
    }

    static petCreate(): ApiOperationOptions {
        return this.composeOperationOptions(PetApiConfiguration.operations.petCreate);
    }

    static petUpdate(): ApiOperationOptions {
        return this.composeOperationOptions(PetApiConfiguration.operations.petUpdate);
    }

    static petDelete(): ApiOperationOptions {
        return this.composeOperationOptions(PetApiConfiguration.operations.petDelete);
    }
}
